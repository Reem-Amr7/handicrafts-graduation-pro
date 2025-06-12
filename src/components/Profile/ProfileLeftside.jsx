import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import markerIconPng from "leaflet/dist/images/marker-icon.png";

function FlyToCity({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 8);
    }
  }, [coords, map]);
  return null;
}

export default function ProfileLeftside() {
  const [userCity, setUserCity] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cityNames = {
    cairo: "القاهرة، مصر",
    alexandria: "الإسكندرية، مصر",
    giza: "الجيزة، مصر",
    nablus: "نابلس، فلسطين",
    jerusalem: "القدس، فلسطين",
    gaza: "غزة، فلسطين",
    amman: "عمان، الأردن",
    irbid: "إربد، الأردن",
    zarqa: "الزرقاء، الأردن",
    beirut: "بيروت، لبنان",
    tripoli_lb: "طرابلس، لبنان",
    damascus: "دمشق، سوريا",
    aleppo: "حلب، سوريا",
    baghdad: "بغداد، العراق",
    basra: "البصرة، العراق",
    erbil: "أربيل، العراق",
    riyadh: "الرياض، السعودية",
    jeddah: "جدة، السعودية",
    mecca: "مكة المكرمة، السعودية",
    medina: "المدينة المنورة، السعودية",
    doha: "الدوحة، قطر",
    manama: "المنامة، البحرين",
    muscat: "مسقط، عمان",
    kuwait_city: "مدينة الكويت، الكويت",
    abu_dhabi: "أبو ظبي، الإمارات",
    dubai: "دبي، الإمارات",
    khartoum: "الخرطوم، السودان",
    tunis: "تونس، تونس",
    sfax: "صفاقس، تونس",
    algiers: "الجزائر العاصمة، الجزائر",
    oran: "وهران، الجزائر",
    casablanca: "الدار البيضاء، المغرب",
    rabat: "الرباط، المغرب",
    marrakesh: "مراكش، المغرب",
    nouakchott: "نواكشوط، موريتانيا",
    mogadishu: "مقديشو، الصومال",
    djibouti: "جيبوتي، جيبوتي",
    sanaa: "صنعاء، اليمن",
    aden: "عدن، اليمن",
    tripoli: "طرابلس، ليبيا",
    benghazi: "بنغازي، ليبيا",
    asmara: "أسمرة، إريتريا"
  };

  const cityCoordinates = {
    cairo: [30.0444, 31.2357],
    alexandria: [31.2001, 29.9187],
    giza: [30.0131, 31.2089],
    nablus: [32.2211, 35.2544],
    jerusalem: [31.7683, 35.2137],
    gaza: [31.5018, 34.4663],
    amman: [31.9516, 35.9239],
    irbid: [32.5556, 35.85],
    zarqa: [32.0728, 36.088],
    beirut: [33.8938, 35.5018],
    tripoli_lb: [34.4367, 35.8497],
    damascus: [33.5138, 36.2765],
    aleppo: [36.2021, 37.1343],
    baghdad: [33.3152, 44.3661],
    basra: [30.5085, 47.7804],
    erbil: [36.1911, 44.0092],
    riyadh: [24.7136, 46.6753],
    jeddah: [21.4858, 39.1925],
    mecca: [21.3891, 39.8579],
    medina: [24.5247, 39.5692],
    doha: [25.276987, 51.520008],
    manama: [26.2235, 50.5822],
    muscat: [23.5880, 58.3829],
    kuwait_city: [29.3759, 47.9774],
    abu_dhabi: [24.4539, 54.3773],
    dubai: [25.2048, 55.2708],
    khartoum: [15.5007, 32.5599],
    tunis: [36.8065, 10.1815],
    sfax: [34.7406, 10.7603],
    algiers: [36.7538, 3.0588],
    oran: [35.6971, -0.6308],
    casablanca: [33.5731, -7.5898],
    rabat: [34.0209, -6.8416],
    marrakesh: [31.6295, -7.9811],
    nouakchott: [18.0735, -15.9582],
    mogadishu: [2.0469, 45.3182],
    djibouti: [11.8251, 42.5903],
    sanaa: [15.3694, 44.1910],
    aden: [12.7856, 45.0187],
    tripoli: [32.8872, 13.1913],
    benghazi: [32.1190, 20.0857],
    asmara: [15.3229, 38.9251]
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const savedCity = localStorage.getItem("userCity");
      if (savedCity) {
        setUserCity(savedCity);
      }
    }
  }, []);

  const handleChangeCity = (e) => {
    const city = e.target.value;
    setUserCity(city);
    if (isLoggedIn) {
      localStorage.setItem("userCity", city);
    }
  };

  const selectedCoords = userCity ? cityCoordinates[userCity] : [30.5, 34.5];

  return (
    <aside className="col-span-4 mr-3 w-[350px] ml-3 p-8">
      <div className="p-5 mt-8 bg-white shadow-md rounded">
        <h2 className="text-lg font-semibold mb-4">مكان الحرفي على الخريطة</h2>

        {isLoggedIn && (
          <select
            className="p-2 border rounded mb-4 w-full"
            value={userCity || ""}
            onChange={handleChangeCity}
          >
            <option value="">اختر المدينة</option>
            {Object.entries(cityNames).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}

        <div className="h-[350px] w-full rounded overflow-hidden">
          <MapContainer
            center={selectedCoords}
            zoom={8}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            {userCity && (
              <>
                <FlyToCity coords={selectedCoords} />
                <Marker
                  position={selectedCoords}
                  icon={L.icon({
                    iconUrl: markerIconPng,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>📍 الحرفي من: {cityNames[userCity]}</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        {userCity && (
          <p className="mt-2 text-sm font-semibold text-right">
            📍 الحرفي من: {cityNames[userCity]}
          </p>
        )}
      </div>
    </aside>
  );
}
