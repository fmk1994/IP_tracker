let userLat;
let userLng;
let IP;
const userIp = document.querySelector('#userIp');
const userLocation = document.querySelector('#userLocation');
const userTimezone = document.querySelector('#userTimezone');
const userIsp = document.querySelector('#userIsp');
const inputField = document.getElementById('search-ip');
const form = document.getElementById('form');
window.addEventListener('DOMContentLoaded', () => {
	getUserData();
});

form.addEventListener('submit', (e) => {
	reloadMap();
	e.preventDefault();
	IP = `=${inputField.value}`;
	ValidateIP(IP);
	inputField.value = '';
});

const getUserData = (IP) => {
	axios
		.get(
			`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_vGDbqjc2sIWwcKCQEoB7GsQqC7A8j&ipAddress${IP}`
		)
		.then((res) => {
			console.log(res);
			userIp.innerText = res.data.ip;
			userLocation.innerText = `${res.data.location.city}, ${res.data.location.country}`;
			userTimezone.innerText = `UTC ${res.data.location.timezone}`;
			userIsp.innerText = res.data.isp;
			userLat = res.data.location.lat;
			userLng = res.data.location.lng;
		})
		.then(() => {
			generateMap(userLat, userLng);
			console.dir(map);
		})
		.catch((err) => {
			console.error(err);
		});
};

const ValidateIP = (IP) => {
	{
		if (
			/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
				inputField.value
			)
		) {
			getUserData(IP);
		} else {
			alert('You have entered an invalid IP address!');
			return false;
		}
	}
};
const reloadMap = () => {
	const map = document.getElementById('map');
	const section = document.querySelector('.map');
	map.remove();
	const newDiv = document.createElement('div');
	section.appendChild(newDiv);
	newDiv.setAttribute('id', 'map');
};
const generateMap = (userLat, userLng) => {
	var container = L.DomUtil.get('map');
	if (container != null) {
		container._leaflet_id = null;
	}
	var map = L.map('map').setView([userLat, userLng], 13);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '© OpenStreetMap',
	}).addTo(map);

	var blackIcon = L.icon({
		iconUrl: './images/icon-location.svg',
		shadowUrl: '',
		iconSize: [32, 40],
		shadowSize: [50, 64],
		iconAnchor: [22, 94],
	});
	L.marker([userLat, userLng], { icon: blackIcon }).addTo(map);
};
