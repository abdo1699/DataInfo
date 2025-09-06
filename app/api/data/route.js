import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data.json');

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function tsForMonth(monthIndex) {
  // monthIndex: 0..11 for 2024
  const base = new Date(Date.UTC(2024, monthIndex, rand(1, 28))).getTime();
  return base;
}

async function ensureSeed() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const json = JSON.parse(raw || '[]');
    if (Array.isArray(json) && json.length === 80) {
      return json; // already seeded correctly
    }
  } catch (_) {
    // continue to seed
  }

  const types = ['villa', 'apartment', 'duplex', 'penthouse', 'townhouse'];
  const cities = [
    { city: 'cairo', lat: 30.0444, lon: 31.2357 },
    { city: 'giza', lat: 30.0131, lon: 31.2089 },
    { city: 'alexandria', lat: 31.2001, lon: 29.9187 },
    { city: 'hurghada', lat: 27.2574, lon: 33.8129 },
    { city: 'luxor', lat: 25.6872, lon: 32.6396 },
    { city: 'aswan', lat: 24.0889, lon: 32.8998 },
    { city: 'ismailia', lat: 30.5833, lon: 32.2667 },
    { city: 'beni suef', lat: 29.0667, lon: 31.1 },
    { city: 'kafr el sheikh', lat: 31.1167, lon: 30.9333 },
    { city: 'qena', lat: 26.1667, lon: 32.7167 },
  ];

  const statuses = ['in progress', 'finished', 'delayed'];

  const records = [];
  for (const type of types) {
    // 16 per type
    for (let i = 0; i < 16; i++) {
      const { city, lat, lon } = pick(cities);
      const size = type === 'apartment' ? rand(70, 120) : type === 'duplex' ? rand(150, 200) : rand(140, 240);
      const price = size * rand(90000, 130000); // synthetic EGP-equivalent units
      const floors = type === 'apartment' ? rand(8, 22) : rand(1, 3);
      const parking = type === 'apartment' ? rand(0, 2) : rand(1, 3);

      // Weight months: many in Nov (10) and Dec (11)
      const month = i < 6 ? rand(0, 5) : (i < 10 ? rand(6, 9) : rand(10, 11));

      records.push({
        propertyType: type,
        size,
        price,
        city,
        latitude: lat,
        longitude: lon,
        floors,
        status: pick(statuses),
        parking_spaces: parking,
        ts: tsForMonth(month),
      });
    }
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(records, null, 2), 'utf8');
  return records;
}

export async function GET() {
  try {
    const data = await ensureSeed();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const raw = await fs.readFile(DATA_PATH, 'utf8').catch(() => '[]');
    const list = JSON.parse(raw || '[]');
    const record = {
      propertyType: String(body.propertyType || 'apartment'),
      size: Number(body.size || 80),
      price: Number(body.price || 8000000),
      city: String(body.city || 'cairo'),
      latitude: Number(body.latitude || 30.0444),
      longitude: Number(body.longitude || 31.2357),
      floors: Number(body.floors || 1),
      status: String(body.status || 'in progress'),
      parking_spaces: Number(body.parking_spaces || 1),
      ts: Number(body.ts || Date.now()),
    };
    list.push(record);
    await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2), 'utf8');
    return NextResponse.json({ ok: true, data: record, total: list.length }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
