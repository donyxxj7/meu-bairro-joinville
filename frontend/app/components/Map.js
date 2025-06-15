// frontend/app/components/Map.js
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Usamos caminhos de string diretos para os ícones na pasta /public
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map({ ocorrencias }) {
  // O useEffect foi removido daqui na nossa refatoração anterior,
  // pois os dados agora vêm via props.
  const initialPosition = [-26.3045, -48.8456];

  return (
    <MapContainer center={initialPosition} zoom={13} style={{ height: '100%', width: '100%' }} className="rounded-lg shadow-md">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* O componente recebe as ocorrências como props e as mapeia */}
      {ocorrencias.map(ocorrencia => (
        <Marker key={ocorrencia.id} position={[ocorrencia.latitude, ocorrencia.longitude]} icon={customIcon}>
          <Popup>
            <b>{ocorrencia.tipo_problema}</b><br />
            {ocorrencia.descricao}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}