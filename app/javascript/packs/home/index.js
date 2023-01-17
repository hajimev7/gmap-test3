let mergedResults;

function initMap() { }

function selectText() {
  document.getElementById("location").disabled = false;
}

function selectCurrent() {
  document.getElementById("location").disabled = true;
  getCurrentLocation();
}

async function search() {
 
  mergedResults = [];
  document.getElementById('results').innerHTML = '';

  let serachMethod;
  document.getElementsByName('serchMethod')?.forEach(item => {
    if (item.checked) {
      serachMethod = item.value;
    }
  });
  const locationText = document.getElementById("location").value;
  const currentLocationText = document.getElementById("currentLocation").innerText;
  const location = serachMethod === 'text' ? await getLocation(locationText) : getPos(currentLocationText);
  
  const map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 15
  });

  const word = document.getElementById("serachWord").value;
  const radius = Number(document.getElementById("radius").value);
  searchNearBy(map, location, word, radius);
  const searchCircle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map,
    center: location,
    radius: radius,
  })
}

async function getLocation(locationName) {
  const geocoder = new google.maps.Geocoder();
  const geocodeRes = await geocoder.geocode({ address: locationName }).catch(() => alert('場所の位置情報が取得できませんでした。'));
  return geocodeRes.results?.[0]?.geometry.location;
}

function getPos(posStr) {
  const posArr = posStr?.split(', ');
  return { lat: Number(posArr[0]), lng: Number(posArr[1]) };
}

async function searchNearBy(map, location, word, radius) {
  const placeService = new google.maps.places.PlacesService(map);
  placeService.nearbySearch({
    location,
    radius: `${radius}`,
    keyword: word,
    type: ['restaurant'],
  }, showResults);
}

function showResults(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    mergedResults = mergedResults.concat(results);
    if (pagination?.hasNextPage) {
      setTimeout(() => { pagination.nextPage(); }, 2000);
    } else {
      const numberOfReviews = Number(document.getElementById("numberOfReviews").value);
      const filteredResults = mergedResults.filter(result => result.user_ratings_total >= numberOfReviews);
      filteredResults.sort((x, y) => {
        if (x.rating < y.rating) return 1;
        if (x.rating > y.rating) return -1;
        return 0;
      });
      const resultsHtml = filteredResults.map(result => {
        return `<li><span>[${result.rating.toFixed(1)}(${result.user_ratings_total})] </span><a href="https://maps.google.co.jp/maps?q=${encodeURIComponent(result.name + ' ' + result.vicinity)}&z=15&iwloc=A target="_blank">${result.name}</a></li>`
      });
      document.getElementById('results').innerHTML = `<ol>${resultsHtml.join('')}</ol>`;
    }
  } else {
    alert('付近のお店が検索できませんでした。')
  }
}

function getPlaces() {
  //結果表示クリア
  document.getElementById("results").innerHTML = "";
  //placesList配列を初期化
  placesList = new Array();
  //入力した検索場所を取得
  const addressInput = document.getElementById("addressInput").value;
  if (addressInput == "") {
    return;
  }
  //検索場所の位置情報を取得
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    {
      address: addressInput
    },
    function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //取得した緯度・経度を使って周辺検索
        startNearbySearch(results[0].geometry.location);
      }
      else {
        alert(addressInput + "：位置情報が取得できませんでした。");
      }
    });
}

function startNearbySearch(latLng) {
  //読み込み中表示
  document.getElementById("results").innerHTML = "Now Loading...";
  //Mapインスタンス生成
  const map = new google.maps.Map(
    document.getElementById("mapArea"),
    {
      zoom: 15,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  );

  const service = new google.maps.places.PlacesService(map);

  const keywordInput = document.getElementById("keywordInput").value;

  const obj = document.getElementById("radiusInput");
  const radiusInput = Number(obj.options[obj.selectedIndex].value);

  service.nearbySearch(
    {
      location: latLng,
      radius: radiusInput,
      type: ['restaurant'],
      keyword: keywordInput,
      language: 'ja'
    },
    displayResults
  );
  const circle = new google.maps.Circle(
    {
      map: map,
      center: latLng,
      radius: radiusInput,
      fillColor: '#ff0000',
      fillOpacity: 0.3,
      strokeColor: '#ff0000',
      strokeOpacity: 0.5,
      strokeWeight: 1
    }
  );
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        document.getElementById("currentLocation").innerText = `${pos.lat}, ${pos.lng}`;
      },
      e => {
        document.getElementById("currentLocation").innerText = `現在地取得失敗`;
        console.error("navigator.geolocation Error: ", e);
      }
    );
  } else {
    document.getElementById("currentLocation").innerText = `現在地取得失敗`;

    console.error("Browser doesn't support Geolocation");
  }
}
