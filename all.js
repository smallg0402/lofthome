const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/";
const token = "xZoGaX0vKFy0k7zIXKmC1H6nzL7objbiVFPrxtx56DfV2frYa15HghW1TkLp";

//獲取頁面節點
const body = document.body;
let index_room_list;
let rooms_roomList;
//共同節點
const modal = document.querySelector(".modal");


//modal視窗節點
const modal_dialog = document.querySelector(".modal-dialog");
const modal_roomTops = document.querySelector(".modal-roomTops");
const modal_roomName = document.querySelector(".modal-roomName");
const modal_roomPrice = document.querySelector(".modal-roomPrice");
const modal_roomthumbs = document.querySelector(".modal-roomthumbs");
const modal_roomIntro = document.querySelector(".modal-roomIntro");
const modal_roomBook = document.querySelector(".modal-roomBook");
const modal_roomOther = document.querySelector(".modal-roomOther");
const modal_roomEqi = document.querySelector(".modal-roomEqi");
const modal_roomInfro = document.querySelector(".modal-roomInfro");

//人數輸入欄節點
const bookAdultsGroup = document.querySelectorAll(".bookAdultsgroup");
const bookKidsGroup = document.querySelectorAll(".bookKidsGroup");
const bookAdults = document.querySelectorAll(".bookAdults");
const bookKids = document.querySelectorAll(".bookKids");

//booking 頁節點
// const formBooking = document.querySelector("#formBooking");
const bookName = document.querySelector("#bookName");
const bookPhone = document.querySelector("#bookPhone");
const bookStartDate = document.querySelector("#bookStartDate");
const bookEndDate = document.querySelector("#bookEndDate");

//
//
let roomsDetailArray = [];

//book Num 起始
let bookAdultsNum = 1;
let bookKidsNum = 0;

//bookingId ;
let bookingId;
//執行初始讀取資料
getdata();

//-------------訂房時間相關設定------------------

//獲取表單日期選擇節點
let inDateDOM = document.querySelectorAll(".inDate");
let outDateDOM = document.querySelectorAll(".outDate");

//獲取今天的年,月,日
let today = new Date();

//轉為input[type="date"]的格式 yyyy-mm-dd
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1; //因為1月為0
let dd = today.getDate();
if (mm < 10) {
  mm = "0" + mm;
}
if (dd < 10) {
  dd = "0" + dd;
}

//所有input date預設起始日期為今日
inDateDOM.forEach((item) => {
  item.value = `${yyyy}-${mm}-${dd}`;
  console.log(`起始日期 ${item.value}`);
});

outDayNeed(today);
maxDay(today);
minDay(today);

function minDay(startdate) {
  let minoutDate = new Date(Date.parse(startdate) + 86400000);
  let minoutyyyy = minoutDate.getFullYear();
  let minoutmm = minoutDate.getMonth() + 1;
  let minoutdd = minoutDate.getDate();

  if (minoutmm < 10) {
    minoutmm = "0" + minoutmm;
  }
  if (minoutdd < 10) {
    minoutdd = "0" + minoutdd;
  }

  //當其中一個inDate節點value改變,其他所有的outDate節點value都會改變

  outDateDOM.forEach((item) => {
    item.setAttribute("min", `${minoutyyyy}-${minoutmm}-${minoutdd}`);
  });
}

//當起始日期更改時,若結束日期-起始日期<86400000毫秒(一天),則變更結束日期,否則只更改最大日期
//邏輯思路：改變訂房日期->取得節點上退房及進房日期數值->退房日期數值-進房日期數值是否>1天
//否：改變退房日期,為訂房日期+1天
//是：不改變退房日期
//每個inDate節點都設定change監聽器
inDateDOM.forEach((item, i) => {
  item.addEventListener("change", function (e) {
    e.preventDefault();
    //當某個inDate節點值變更時,所有的inDate節點的值都等於該改變節點的值
    inDateDOM.forEach((newitem) => {
      newitem.value = item.value;
    });
    //讀取改變的inDate節點對應的outDate節點值再進行計算
    let outDateInt = Date.parse(outDateDOM[i].value);
    let inDateInt = Date.parse(item.value);
    if (outDateInt - inDateInt < 86400000) {
      //如果符合條件則更改所有outDate節點值
      outDayNeed(item.value);
    }
    //更改所有outDate節點最大值
    maxDate(item.value);
    //更改所有outDate節點最小值
    minDay(item.value);
  });
});

//函式：最大日期設定為起始日+90天
function maxDay(startDate) {
  let maxOutDate = new Date(Date.parse(startDate) + 86400000 * 90);
  let maxoutyyyy = maxOutDate.getFullYear();
  let maxoutmm = maxOutDate.getMonth() + 1;
  let maxoutdd = maxOutDate.getDate();

  if (maxoutmm < 10) {
    maxoutmm = "0" + maxoutmm;
  }
  if (maxoutdd < 10) {
    maxoutdd = "0" + maxoutdd;
  }

  outDateDOM.forEach((item) => {
    item.setAttribute("max", `${maxoutyyyy}-${maxoutmm}-${maxoutdd}`);
  });
}

//函式： 設定outDate為起始日+1天
function outDayNeed(inDate) {
  //預設退房日期為起始+1天;
  //+1天的毫秒為今日+86400000秒,使用毫秒轉為日期格式
  let outDate = new Date(Date.parse(inDate) + 86400000);

  //獲取 yyyy,mm,dd
  let outyyyy = outDate.getFullYear();
  let outmm = outDate.getMonth() + 1;
  let outdd = outDate.getDate();

  //mm及dd字串格式判定
  if (outmm < 10) {
    outmm = "0" + outmm;
  }
  if (outdd < 10) {
    outdd = "0" + outdd;
  }

  outDateDOM.forEach((item) => {
    item.value = `${outyyyy}-${outmm}-${outdd}`;
  });
}

//成人人數預設
bookAdults.forEach((item) => {
  item.value = bookAdultsNum;
});
//兒童人數預設
bookKids.forEach((item) => {
  item.value = bookKidsNum;
});
//設定成人人數選擇器監聽
bookAdultsGroup.forEach((item) => {
  item.addEventListener("click", function (e) {
    if (
      e.target.getAttribute("class").indexOf("input-group-text-prepend") != -1
    ) {
      bookAdultsNum--;
      console.log("-");
    } else if (
      e.target.getAttribute("class").indexOf("input-group-text-append") != -1
    ) {
      bookAdultsNum++;
      console.log("+");
    }
    console.log(bookAdultsNum);
    if (bookAdultsNum < 0) {
      bookAdultsNum = 0;
    }
    //全部的bookAdults input value皆改變
    bookAdults.forEach((adults) => {
      adults.value = bookAdultsNum;
    });
  });
});

//成人人數欄位監聽
bookAdults.forEach((item) => {
  item.addEventListener("change", function (e) {
    bookAdultsNum = item.value;
  });
});

//設定兒童人數選擇器監聽
bookKidsGroup.forEach((item) => {
  item.addEventListener("click", function (e) {
    if (
      e.target.getAttribute("class").indexOf("input-group-text-prepend") != -1
    ) {
      bookKidsNum--;
    } else if (
      e.target.getAttribute("class").indexOf("input-group-text-append") != -1
    ) {
      bookKidsNum++;
    }
    if (bookKidsNum < 0) {
      bookKidsNum = 0;
    }

    bookKids.forEach((kids) => {
      kids.value = bookKidsNum;
    });
  });
});

//兒童人數欄位監聽
bookKids.forEach((item) => {
  item.addEventListener("change", function (e) {
    bookKidsNum = item.value;
  });
});

//booking頁監聽

// formBooking.addEventListener('click',function(e){
//   e.preventDefault();
//   let btnValue = e.target.value;
//   if(btnValue == 'BOOK NOW'){

//   }else if(btnValue == 'Back'){

//   }else{
//     return;
//   }
// })

//booking 函式
function booking() {
  let nameValue = bookName.value;
  let phoneValue = bookPhone.value;
  let bookStartValue = bookStartDate.value;
  let bookEndValue = bookEndDate.value;
  axios
    .post(
      `${url}room/3Elqe8kfMxdZv5xFLV4OUeN6jhmxIvQSTyj4eTgIowfIRvF4rerA2Nuegzc2Rgwu`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

//切換不同網頁時初始讀取資料函式
function getdata() {
  let path = window.location.pathname;
  if(path.indexOf("/index.html") != -1){
    this.index_room_list = document.querySelector(".index-room-list");
    //首頁節點增加監聽器
    this.index_room_list.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(e.target.getAttribute("class"));
      if (e.target.getAttribute("class").indexOf("roomCard") != -1) {
        body.setAttribute("class", "open-modal");
        let no = e.target.getAttribute("data-roomno");
        modalRender(roomsDetailArray[no]);
      }
    });
  }else if(path.indexOf("/rooms.html") != -1){
    //rooms節點
    this.rooms_roomList = document.querySelector(".rooms_roomList");
    this.rooms_roomList.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(e.target.getAttribute("class"));
      if (e.target.getAttribute("class").indexOf("rooms-btn-more") != -1) {
        body.setAttribute("class", "open-modal");
        let no = e.target.getAttribute("data-roomno");
        console.log(`roomno${no}`);
        modalRender(roomsDetailArray[no]);
      }
    });


  }
  axios
    .get(`${url}rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    .then((response) => {
      let roomsdata = response.data.items;
      let idArray = [];
      roomsdata.forEach(function (item) {
        idArray.push(item.id);
        console.log(idArray);
      });
      getRoomsDetail(idArray[0])
        .then((response) => {
          return getRoomsDetail(idArray[1]);
        })
        .then((response) => {
          return getRoomsDetail(idArray[2]);
        })
        .then((response) => {
          return getRoomsDetail(idArray[3]);
        })
        .then((response) => {
          return getRoomsDetail(idArray[4]);
        })
        .then((response) => {
          return getRoomsDetail(idArray[5]);
        })
        .then((response) => {
          console.log(roomsDetailArray);
          //待所有房間的詳細資料皆載入後一次渲染
          roomsRender(roomsDetailArray);
        })
        .catch((error) => {
          console.log(error);
        });
      indexRender(roomsdata);
    })
    .catch((error) => {
      console.log(error);
    });
  if (path.indexOf("/index.html") != -1) {
    //取得首頁節點
  } else if (path.indexOf("/rooms.html") != -1) {
    axios
      .get(`${url}rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        let roomsdata = response.data.items;
        //由roomsdata各房間基本資料獲取id,用id去取得各房間的詳細資料
        //此段程式碼需重構
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (path.indexOf("/booking.html") != -1) {
    // booking();
  }
}
//利用各房間id接收所有房間的詳細資料非同步函式
// function reciveAllDetail(roomsdata){
//   return new Promise(function(resolve,reject){
//     roomsdata.forEach(function(item){
//       getRoomsDetail(item.id);
//     })
//   })
// }

//獲取單一房間的詳細資料
function getRoomsDetail(id) {
  return new Promise((resolve, reject) => {
    //接收單一房間詳細資料的變數
    let roomdetail = [];
    //利用房間id網址傳送請求
    axios
      .get(`${url}room/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then(function (response) {
        console.log(response);
        roomdetail = response.data.room;
        //此陣列只有一筆物件資料,因此要取第0筆資料為房間詳細資料,並推入房間詳細資料陣列
        roomsDetailArray.push(roomdetail[0]);
        resolve();
      })
      .catch(function (error) {
        console.log(error);
        reject();
      });
  });
}

//首頁資料初始化
function indexRender(roomsdata) {
  //取得首頁房間列表節點

  //新增row列
  let row_str = `<div class="indexRoomList-row row-5 mb-1"></div>`;
  let col_str = "";
  let datalength = roomsdata.length;
  //依據資料長度,一列會有3筆資料,因此需要datalength/3個列,但因已經有基底字串,因此-1
  for (i = 0; i < datalength / 3 - 1; i++) {
    row_str += `<div class="indexRoomList-row row-5"></div>`;
  }
  //將列渲染至畫面上
  
  this.index_room_list.innerHTML = row_str;
  //取得所有的row節點
  let indexRoomList_row = document.querySelectorAll(".indexRoomList-row");
  console.log(`新增row${indexRoomList_row[0]}`);
  //進行字串相加時row col判斷值
  let col_num = 1;
  let row_num = 0;
  let no = 0;

  roomsdata.forEach(function (item, index) {
    console.log(`此時渲染的row=${row_num},col=${col_num}`);
    console.log(col_str);
    indexRoomList_row[row_num].innerHTML += `
      <div class="col-5-4">
         <a href="" class="relative d-block text-light roomCard" data-roomno=${no}>
            <img src=${item.imageUrl} alt="" class="w-100 h-100">
            <div class="absolute w-100 h-100 align-items-center  d-flex justify-content-center roomCard-float">
               <p class="h2">${item.name}</p>
           </div>
         </a>
       </div>`;
    // 如果col=3 ,則至下一個row渲染,且欄位數回歸1
    if (col_num == 3) {
      row_num += 1;
      col_num = 1;
    } else {
      col_num++;
    }
  });
}
//modal資料渲染
function modalRender(roomDetail) {
  let slideStr = "";
  let priceStr = `
  <li class="display-2 mr-2 d-flex align-items-center"><span class="small">平日每晚</span>$${roomDetail.normalDayPrice}</li>
  <li class="display-2 mr-2 mt-4 d-flex align-items-center"><span class="small">假日每晚</span>$${roomDetail.holidayPrice}</li>
    `;

  let infroStr = `
  <li class="col-16-2">
    <p class="add-before-line">人數：${roomDetail.descriptionShort.GuestMax}</p>
    <p class="add-before-line mt-3">床型：${roomDetail.descriptionShort.Bed}</p>  
  </li>
  <li class="col-16-2">
    <p class="add-before-line">坪數：${roomDetail.descriptionShort.Footage}平方公尺</p>  
    <p class="add-before-line mt-3">餐點：附早餐</p>  
  </li>
  <li class="col-16-4">
    <p class="add-before-line">checkIn 時間：最早 ${roomDetail.checkInAndOut.checkInEarly}、最晚 ${roomDetail.checkInAndOut.checkInLate}</p>  
    <p class="add-before-line mt-3">checkOut 時間：${roomDetail.checkInAndOut.checkOut}</p>  
  </li>
  `;

  modal_roomName.textContent = roomDetail.name;
  roomDetail.imageUrl.forEach(function (imgurl) {
    slideStr += ` 
    <div class="swiper-slide text-center">
    <img src=${imgurl} alt="" class="h-100 ">
    </div>`;
  });
  modal_roomTops.innerHTML = slideStr;
  modal_roomthumbs.innerHTML = slideStr;
  modal_roomPrice.innerHTML = priceStr;
  modal_roomIntro.inncerHTML = roomDetail.description;
  modal_roomInfro.innerHTML = infroStr;
  modal_roomBook.setAttribute("data-bookid", roomDetail.id);
}
//初始化rooms頁面資料
function roomsRender(data) {
  let str = "";
  let roomNo = 0;
  //將所有資料進行加入渲染字串
  data.forEach(function (item) {
    console.log(item);
    str += ` 
    <div class="row-36 mb-6">
    <div class="col-36-4">
        <div class="imgCard roomPicCard">
            <img src=${item.imageUrl} alt="">
            <a href="" class="h2 text-light">${item.name}</a>
        </div>
    </div>
    <div class="card col-36-8 container-48 d-flex flex-column">
        <h3 class="h2 bold">${item.name}</h3>
        <div class="row-48 mt-3 card_body">
            <div class="col-48-6 d-flex flex-column justify-content-between">
                <div class="container-46 px-0">
                  <ul class="row-46">
                      <li class="col-46-6">
                          <p class="add-before-line">人數：${
                            item.descriptionShort.GuestMax
                          }</p>
                          <p class="add-before-line mt-3">床型：${
                            item.descriptionShort.Bed
                          }</p>  
                      </li>
                      <li class="col-46-6">
                          <p class="add-before-line">坪數：${
                            item.descriptionShort.Footage
                          }平方公尺
                          </p>  
                          <p class="add-before-line mt-3">餐點：附早餐</p>  
      
                      </li>
                  </ul>
                </div>
                <div class="container-12 px-0 roomAmenities">
                    <ul class="row-12" >
                        <li class="text-center col-12-3">
                            <img src="img/icon_fridge.png" alt="" class="p">
                        </li>
                        <li class="text-center col-12-3">
                            <img src="img/icon_toilet.png" alt="">
                           
                        </li>
                        <li class="text-center col-12-3">
                            <img src="img/icon_wifi.png" alt="">         
                        </li>
                        <li class="text-center col-12-3">
                            <img src="img/icon_fridge.png" alt="" class="p">
                        </li>

                    </ul>
                    <ul class="row-12 mt-2 ">
                        <li class="text-center col-12-3">
                            <img src="img/icon_fridge.png" alt="" class="p">
                        </li>
                        <li class="text-center col-12-3">
                            <img src="img/icon_toilet.png" alt="">
                           
                        </li>
                        <li class="text-center col-12-3">
                            <img src="img/icon_wifi.png" alt="">         
                        </li>

                    </ul>
                
                </div>
                
                
            </div>
            <div class="d-flex flex-column col-48-5 ml-auto justify-content-between pt-3">
                  <ul class="align-self-end">
                      <li class="display-2 mr-2 d-flex align-items-center"><span class="small">平日每晚</span>$${item.normalDayPrice.toLocaleString()}</li>
                      <li class="display-2 mr-2 mt-4 d-flex align-items-center"><span class="small">假日每晚</span>$${item.holidayPrice.toLocaleString()}</li>
                  </ul>
                  <div class="align-self-end">
                      <a href="" class="btn rooms-btn-more bg-light text-dark mr-2" data-roomno=${roomNo} data-roomnd=${
      item.id
    }>MORE +</a>
                      <a href="" class="btn text-light bg-dark rooms-btn-book ">BOOK NOW</a>
                  </div>

            </div>
        </div>
        
    </div>

</div>`;
    //用來放在class=data-roomNo 代表房間編號,可以辨識按more按紐要讀取roomDetailArray中哪一筆資料
    roomNo++;
  });
  //進行第一次頁面渲染
  rooms_roomList.innerHTML = str;

  //房間卡面中 房間設施圖案渲染

  //獲取頁面房間的設施div節點陣列
  let roomAmenitiesArray = document.querySelectorAll(".roomAmenities");
  console.log(roomAmenitiesArray);
  //每一個房間設施節點,對應的是一筆房間詳細資料
  for (let i = 0; i < roomAmenitiesArray.length; i++) {
    let amenitiesStr = "";
    let colNum = 0;
    if (data[i].amenities.Breakfast) {
      amenitiesStr += `
      <li class="text-center col-12-3">
       <img src="img/icon_fork.png" alt="附早餐" class="">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }
    if (data[i].amenities.Refrigerator) {
      amenitiesStr += `
      <li class="text-center col-12-3">
       <img src="img/icon_fridge.png" alt="冰箱" class="p">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }
    if (data[i].amenities["Mini-Bar"]) {
      amenitiesStr += `
      <li class="text-center col-12-3">
        <img src="img/icon_toilet.png" alt="獨立衛浴">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }
    if (data[i].amenities["Wi-Fi"]) {
      amenitiesStr += `
      <li class="text-center col-12-3">
        <img src="img/icon_wifi.png" alt="Wi-Fi">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }
    if (data[i].amenities["Room-Service"]) {
      amenitiesStr += `
      <li class="text-center col-12-3">
        <img src="img/icon_phone.png" alt="客房服務">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }
    if (data[i].amenities["Pet-Friendly"]) {
      amenitiesStr += `
      <li class="text-center col-12-3">
        <img src="img/icon_pet.png" alt="寵物友善">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }
    if (data[i].amenities["Smoke-Free"]) {
      amenitiesStr += `
      <li class="text-center col-12-3">
        <img src="img/icon_no-smoking.png" alt="禁菸">
      </li>`;
      colNum++;
      if (colNum == 4) {
        amenitiesStr += `</ul>
        <ul class="row-12" >`;
        colNum = 0;
      }
    }

    roomAmenitiesArray[i].innerHTML =
      `<ul class="row-12" >` + amenitiesStr + `</ul>`;
  }
}

//首頁banner Swiper
$(document).ready(function () {
  const swiper = new Swiper("#homeSwiper", {
    // Optional parameters
    speed: 1500,
    loop: false,
    autoplay: {
      delay: 3000,
    },
    effect: "flip",

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

//modal 啟用gallery swiper
$(document).ready(function () {
  let galleryThumbs = new Swiper(".gallery-thumbs", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: false,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });
  let galleryTop = new Swiper(".gallery-top", {
    spaceBetween: 10,
    navigation: {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev",
    },
    thumbs: {
      swiper: galleryThumbs,
    },
  });
});

//Modal 開啟

//首頁表單列表監聽



$(document).ready(function () {
  $(".modal-close").click(function (e) {
    e.preventDefault();
    body.setAttribute("class", "");
  });
});

//rooms頁roomList監聽


// $(document).ready(function(){
//   $(".roomCard").click(function (e) {
//     console.log(e.target);
//     e.preventDefault();
//     $(".modal").toggle();
//   });

// })
