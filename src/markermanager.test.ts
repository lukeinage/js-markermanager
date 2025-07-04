/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference types="@types/jest" />
/// <reference types="@types/google.maps" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MarkerManager } from "./markermanager";
import { initialize } from "@googlemaps/jest-mocks";
import { GridBounds } from "./gridbounds";

beforeEach(() => {
  initialize();
});

test("can construct MarkerManager", () => {
  const zoom = 10;
  const map = new google.maps.Map(null);
  (map.getZoom as jest.Mock).mockReturnValueOnce(zoom);

  const mm = new MarkerManager(map, {});

  expect(map.getZoom).toHaveBeenCalledTimes(1);
  expect(mm["_mapZoom"]).toBe(zoom);
});

test("can add and remove markers", () => {
  const map = new google.maps.Map(null);
  const mm = new MarkerManager(map, {});
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: { lat: 0, lng: 0 },
  });
  // Ensure position is set properly on the mock
  marker.position = { lat: 0, lng: 0 };

  mm["_shownBounds"] = new GridBounds(
    [new google.maps.Point(-10, -10), new google.maps.Point(10, 10)],
    6
  );
  mm.addMarker(marker, 0, 10);

  expect(mm.shownMarkers).toBe(1);
  expect(mm.getMarker(0, 0, 0)).toBe(marker);

  mm.removeMarker(marker);
});

test("can handle AdvancedMarkerElement with LatLngLiteral position", () => {
  const map = new google.maps.Map(null);
  const mm = new MarkerManager(map, {});

  // Create marker with LatLngLiteral position (object with lat/lng properties)
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: { lat: 37.7749, lng: -122.4194 }, // This is a LatLngLiteral, not LatLng object
  });
  // Ensure position is set properly on the mock
  marker.position = { lat: 37.7749, lng: -122.4194 };

  mm["_shownBounds"] = new GridBounds(
    [new google.maps.Point(-10, -10), new google.maps.Point(10, 10)],
    6
  );

  // This should not throw "latlng.lng is not a function" error
  expect(() => {
    mm.addMarker(marker, 0, 10);
  }).not.toThrow();

  expect(mm.shownMarkers).toBe(1);
  mm.removeMarker(marker);
});
