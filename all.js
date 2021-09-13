const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/";
const token = "xZoGaX0vKFy0k7zIXKmC1H6nzL7objbiVFPrxtx56DfV2frYa15HghW1TkLp";

//獲取頁面節點
const body = document.body;

//共同節點
const modal = document.querySelector(".modal");

//modal視窗節點
const modal_dialog = document.querySelector(".modal-dialog");
const modal_roomTops = document.querySelector(".modal-roomTops .swiper-wrapper");
const modal_roomName = document.querySelector(".modal-roomName");
const modal_roomPrice = document.querySelector(".modal-roomPrice");
const modal_roomthumbs = document.querySelector(".modal-roomthumbs .swiper-wrapper");
const modal_roomIntro = document.querySelector(".modal-roomIntro");
const modal_roomBook = document.querySelector(".modal-roomBook");
const modal_roomOther = document.querySelector(".modal-roomOther");
const modal_roomEqi = document.querySelector(".modal-roomEqi");
const modal_roomInfro = document.querySelector(".modal-roomInfro");

//人數輸入欄節點
const bookAdultsGroup = document.querySelectorAll(".bookAdultsGroup");
const bookKidsGroup = document.querySelectorAll(".bookKidsGroup");
const bookAdults = document.querySelectorAll(".bookAdults");
const bookKids = document.querySelectorAll(".bookKids");
const btn_bookNow = document.querySelector(".btn-bookNow");

//首頁節點
let index_room_list;
let serchRoom_submit;
//rooms頁節點
let rooms_roomList;

let loading_screen;
let loading_screen_classList;

//booking 頁節點
// const formBooking = document.querySelector("#formBooking");
let bookRoomNameDOM;
let bookNameDOM;
let bookPhoneDOM;
let bookStartDateDOM;
let bookEndDateDOM;

//頁面路徑
let path = window.location.pathname;
//
let roomsDetailArray = [];

//book Num 起始
let bookAdultsNum = 1;
let bookKidsNum = 0;
let serchNum = bookAdultsNum+bookKidsNum;
console.log(serchNum);

//bookingId ;
let bookingId;

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

//成人人數預設
bookAdults.forEach((item) => {
  item.value = bookAdultsNum;
});
//兒童人數預設
bookKids.forEach((item) => {
  item.value = bookKidsNum;
});

//切換不同網頁時抓取節點及取的遠端資料函式物件
let getdata = {
  //不同頁面的節點設定
  pathDomEvent: function () {
    console.log(path+'type'+typeof(path));
    //在首頁時
    if (path.indexOf("/index.html") != -1 || path == '/lofthome/') {
      index_room_list = document.querySelector(".index-room-list");
      serchRoom_submit = document.querySelector(".serchRoom-submit"); 
      //要傳送給rooms頁的數值預設為0
      window.localStorage.setItem("bookAdults",0);
      window.localStorage.setItem("bookKids",0);

      
      //首頁節點增加監聽器
      index_room_list.addEventListener("click", function (e) {
        e.preventDefault();
        console.log(e.target);
        if (e.target.getAttribute("class").indexOf("roomCard-float") != -1) {
          body.setAttribute("class", "open-modal");
          console.log(e.target);
          let no = e.target.getAttribute("data-roomno");
          console.log(no);
          console.log(roomsDetailArray);
          modalRender(roomsDetailArray[no]);
        }
      });
      serchRoom_submit.addEventListener("click",function(e){
        e.preventDefault();
        window.localStorage.setItem("inDate",inDateDOM[0].value);
        window.localStorage.setItem("outDate",outDateDOM[0].value);
        window.localStorage.setItem("bookAdults",bookAdultsNum);
        window.localStorage.setItem("bookKids",bookKidsNum);
        //不需要完整網址嗎？為什麼依然有效
        window.location.href = "rooms.html";
        
        
        

      })
      //在rooms頁時
    } else if (path.indexOf("/rooms.html") != -1) {
      //rooms節點
      console.log(this);
      rooms_roomList = document.querySelector(".rooms_roomList");
      loading_screen = document.querySelector(".loading-screen");
      let room_serch = document.querySelector(".bookroom-submit");
      let rooms_serchingOut = document.querySelector(".serchingOut");
      let rooms_serchingOut_Num = document.querySelector(".serchingOut-Num");
      loading_screen = document.querySelector(".loading-screen");
      loading_screen_classList = document.querySelector(".loading-screen").getAttribute("class");

      
      let indexSerch_adults;
      let indexSerch_kids;
      //將localstorage取出的值轉回原本的整數
      indexSerch_adults = JSON.parse(window.localStorage.getItem("bookAdults"));
      indexSerch_kids = JSON.parse(window.localStorage.getItem("bookKids"));
      //讀取是否有首頁搜尋的欄位數值是否為0,若否則改變bookAdultsNum/bookAdultsNum/serchNum的數值
      if(indexSerch_adults != 0){
        bookAdultsNum = indexSerch_adults;
        bookAdults.forEach((item) => {
          item.value = indexSerch_adults;
        });
        window.localStorage.setItem("bookAdults",0);
       

      }
      if(indexSerch_kids != 0){
        bookKidsNum = indexSerch_kids;
        bookKids.forEach((item) => {
          item.value = indexSerch_kids;
        });
        window.localStorage.setItem("bookKids",0);
      }

      serchNum = bookAdultsNum + bookKidsNum;
      

      //roomserchBar點擊事件
      room_serch.addEventListener("click",function(e){
        e.preventDefault();
        loading_screen_classList = loading_screen_classList.replace("d-none","d-block");
        loading_screen.setAttribute("class",loading_screen_classList);
        //過2秒後再顯示搜尋結果
        setTimeout(function(){
          serchNum = bookKidsNum+bookAdultsNum;
          rooms_serchingOut.setAttribute("class","d-block");
          rooms_serchingOut_Num.textContent = serchNum; 
          roomsPageRender(roomsDetailArray);
        },2000);
        

      })
      //roomList點擊事件
      rooms_roomList.addEventListener("click", function (e) {
        e.preventDefault();
        if (e.target.getAttribute("class").indexOf("btn-more") != -1) {
          body.setAttribute("class", "open-modal");
          let no = e.target.getAttribute("data-roomno");
          console.log(`roomno${no}`);
          modalRender(roomsDetailArray[no]);
          console.log("roomsDetailtest" + roomsDetailArray[0]);
        } else if (
          e.target.getAttribute("class").indexOf("btn-bookNow") != -1
        ) {
          let no = e.target.getAttribute("data-roomno");
          window.localStorage.setItem(
            "bookRoomNameValue",
            roomsDetailArray[no].name
          );
          window.localStorage.setItem("bookRoomId", roomsDetailArray[no].id);
          let weekDay = new Date(Date.parse(inDateDOM[0].value)).getDay();
          console.log("星期" + weekDay);
          //如果不是星期六日(用getDay()取得0或6)則為平日價
          //getDay()取得的星期一至星期日：數字為,1,2,3,4,5,6,0;
          if ((weekDay == 5) | (weekDay == 6)) {
            window.localStorage.setItem("bookWhatDayValue", "假日每晚");
            window.localStorage.setItem(
              "bookPriceValue",
              roomsDetailArray[no].holidayPrice.toLocaleString()
            );
          } else {
            window.localStorage.setItem("bookWhatDayValue", "平日每晚");
            window.localStorage.setItem(
              "bookPriceValue",
              roomsDetailArray[no].normalDayPrice.toLocaleString()
            );
          }
          window.localStorage.setItem("bookStartValue", inDateDOM[0].value);
          window.localStorage.setItem("bookEndDateValue", outDateDOM[0].value);
          window.location.href = "booking.html";
        }
      });
    } else if (path.indexOf("/booking") != -1) {
      //booking頁節點
      let formBooking = document.querySelector("#formBooking");
      bookRoomNameDOM = document.querySelector("#bookRoomNameDOM");
      bookNameDOM = document.querySelector("#bookNameDOM");
      bookPhoneDOM = document.querySelector("#bookPhoneDOM");
      bookStartDateDOM = document.querySelector("#bookStartDateDOM");
      bookEndDateDOM = document.querySelector("#bookEndDateDOM");
      bookPriceDOM = document.querySelector("#bookPriceDOM");
      bookWhatDayDOM = document.querySelector("#bookWhatDayDOM");

      //由本地端儲存rooms或首頁紀錄的訂房資訊

      bookRoomNameDOM.textContent = window.localStorage.getItem(
        "bookRoomNameValue"
      );
      bookStartDateDOM.value = window.localStorage.getItem("bookStartValue");
      bookEndDateDOM.value = window.localStorage.getItem("bookEndDateValue");
      bookPriceDOM.textContent = window.localStorage.getItem("bookPriceValue");
      bookWhatDayDOM.textContent = window.localStorage.getItem(
        "bookWhatDayValue"
      );
      //booking設定按鈕監聽
      formBooking.addEventListener("click", function (e) {
        e.preventDefault();
        let btnValue = e.target.getAttribute("id");
        console.log(btnValue);
        if (btnValue == "btn-back") {
          //將網址導向rooms.html頁
          window.location.href = "rooms.html";
        } else if (btnValue == "btn-bookCheck") {
          // booking(window.localStorage.getItem("bookRoomId"));
          alert("已預定成功");
        }
      });
    }
  },
  getData: function () {
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
            console.log("final" + roomsDetailArray);
            //待所有房間的詳細資料皆載入後判斷為哪一個頁面再進行渲染
            if (path.indexOf("/index.html") != -1 || path == '/lofthome/') {
              indexPageRender(roomsdata);
            } else if (path.indexOf("/rooms.html") != -1) {
              roomsPageRender(roomsDetailArray);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
//執行初始讀取資料
getdata.pathDomEvent();
getdata.getData();

//-------------時間相關設定------------------

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
    maxDay(item.value);
    //更改所有outDate節點最小值
    minDay(item.value);
  });
});
//在此設定一個ouDate節點的值切換時,其他outDate節點也會跟著變動
outDateDOM.forEach((item, i) => {
  item.addEventListener("change", function (e) {
    e.preventDefault();
    //當某個inDate節點值變更時,所有的inDate節點的值都等於該改變節點的值
    outDateDOM.forEach((newitem) => {
      newitem.value = item.value;
    });
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






//modal book-Now按鈕監聽
btn_bookNow.addEventListener("click", function(e){
  let no = e.target.getAttribute("data-roomno");
          window.localStorage.setItem(
            "bookRoomNameValue",
            roomsDetailArray[no].name
          );
          window.localStorage.setItem("bookRoomId", roomsDetailArray[no].id);
          let weekDay = new Date(Date.parse(inDateDOM[0].value)).getDay();
          console.log("星期" + weekDay);
          //如果不是星期六日(用getDay()取得0或6)則為平日價
          //getDay()取得的星期一至星期日：數字為,1,2,3,4,5,6,0;
          if ((weekDay == 5) | (weekDay == 6)) {
            window.localStorage.setItem("bookWhatDayValue", "假日每晚");
            window.localStorage.setItem(
              "bookPriceValue",
              roomsDetailArray[no].holidayPrice.toLocaleString()
            );
          } else {
            window.localStorage.setItem("bookWhatDayValue", "平日每晚");
            window.localStorage.setItem(
              "bookPriceValue",
              roomsDetailArray[no].normalDayPrice.toLocaleString()
            );
          }
          window.localStorage.setItem("bookStartValue", inDateDOM[0].value);
          window.localStorage.setItem("bookEndDateValue", outDateDOM[0].value);
          window.location.href = "booking.html";
});
//設定成人人數選擇器監聽
bookAdultsGroup.forEach((item) => {
  item.addEventListener("click", function (e) {
    console.log("click");
    if (e.target.getAttribute("class").indexOf("input-group-prepend") != -1) {
      if (bookAdultsNum > 0) {
        if(bookAdultsNum+bookKidsNum == 1){
          alert("住房人數不得低於1人");
        }else{
          bookAdultsNum--;
        }
        
      }
    } else if (e.target.getAttribute("class").indexOf("input-group-append") != -1) {
      //如果大人+小孩數量小於4,此數量才能增加
      if(bookAdultsNum+bookKidsNum < 4){
        bookAdultsNum++;
      }else{
        alert("已經超過所有房型最大人數4人");
      }
      console.log("+");
  
    }
    console.log(bookAdultsNum);
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
    if (e.target.getAttribute("class").indexOf("input-group-prepend") != -1) {
      if (bookAdultsNum > 0){
        if(bookAdultsNum+bookKidsNum == 1){
          alert("住房人數不得低於1人");
        }else{
          bookKidsNum--;
        }
      }
    }else if (e.target.getAttribute("class").indexOf("input-group-append") != -1) {
      //如果大人+小孩數量小於4,此數量才能增加
      if(bookAdultsNum+bookKidsNum < 4){
        bookKidsNum++;
      }else{
        alert("已經超過房型最大人數4人");
      }
      console.log("+");
      
    }
    console.log(bookKidsNum);
    //全部的bookAdults input value皆改變
    bookKids.forEach((Kids) => {
      Kids.value = bookKidsNum;
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

//booking 函式
function booking(id) {
  axios
    .post(
      `${url}room/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
      {
        params: {
          name: bookNameDOM.value,
          tel: bookPhoneDOM.value,
          date: ["2021-08-28", "2021-08-29"],
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
    let roomdetail = {};
    console.log("id" + id);
    //利用房間id網址傳送請求
    axios
      .get(`${url}room/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then(function (response) {
        roomdetail = response.data.room[0];
        //此陣列只有一筆物件資料,因此要取第0筆資料為房間詳細資料,並推入房間詳細資料陣列

        roomsDetailArray.push(roomdetail);
        console.log("roomdetail,here" + roomdetail);
        resolve();
      })
      .catch(function (error) {
        console.log(error);
        reject();
      });
  });
}

//首頁資料初始化
function indexPageRender(roomsdata) {
  //取得首頁房間列表節點

  //新增row列
  let row_str = `<div class="indexRoomList-row row-5"></div>`;
  let col_str = "";
  let datalength = roomsdata.length;
  //依據資料長度,一列會有3筆資料,因此需要datalength/3個列,但因已經有基底字串,因此-1
  for (i = 0; i < datalength / 3 - 1; i++) {
    row_str += `<div class="indexRoomList-row row-5"></div>`;
  }
  //將列渲染至畫面上
  console.log(this);
  index_room_list.innerHTML = row_str;
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
      <div class="indexRoomList-col col-5-4 col-md-5-6 col-sm-5-12">
         <a href="" class="relative d-block text-light roomCard">
            <img src=${item.imageUrl} alt="" class="w-100 h-100">
            <div class="absolute w-100 h-100 align-items-center  d-flex justify-content-center roomCard-float" data-roomno=${no}>
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
    no++;
  });
  
}
//modal資料渲染
function modalRender(roomDetail) {
  console.log(roomDetail);
  let slideStr = "";
  let priceStr = `
  <li class="display-2 mr-2 d-flex align-items-center"><span class="small">平日每晚</span>$${roomDetail.normalDayPrice.toLocaleString()}</li>
  <li class="display-2 mr-2 mt-4 d-flex align-items-center"><span class="small">假日每晚</span>$${roomDetail.holidayPrice.toLocaleString()}</li>
    `;

  let infroStr = `
  <li class="col-16-2 col-md-16-6">
    <p class="add-before-line">人數：${roomDetail.descriptionShort.GuestMax}</p>
    <p class="add-before-line mt-3">床型：${roomDetail.descriptionShort.Bed}</p>  
  </li>
  <li class="col-16-2 col-md-16-6">
    <p class="add-before-line">坪數：${roomDetail.descriptionShort.Footage}平方公尺</p>  
    <p class="add-before-line mt-3">餐點：附早餐</p>  
  </li>
  <li class="col-16-4 col-md-16-12 mt-md-5">
    <p class="add-before-line">checkIn 時間：最早 ${roomDetail.checkInAndOut.checkInEarly}、最晚 ${roomDetail.checkInAndOut.checkInLate}</p>  
    <p class="add-before-line mt-3">checkOut 時間：${roomDetail.checkInAndOut.checkOut}</p>  
  </li>
  `;

  modal_roomName.textContent = roomDetail.name;
  roomDetail.imageUrl.forEach(function (imgurl) {
    slideStr += ` 
    <div class="swiper-slide">
    <img src=${imgurl} alt="">
    </div>`;
  });
  modal_roomTops.innerHTML = slideStr;
  modal_roomthumbs.innerHTML = slideStr;
  modal_roomPrice.innerHTML = priceStr;
  modal_roomIntro.inncerHTML = roomDetail.description;
  modal_roomInfro.innerHTML = infroStr;
  modal_roomBook.setAttribute("data-bookid", roomDetail.id);
}
//rooms頁面資料渲染
function roomsPageRender(data) {
  //渲染字串歸零 
  let str = "";
  let roomNo = 0;
  data.forEach(function (item) {
    console.log(item);
    //如果該房型的最大人數大於或等於人數值,則進入渲染字串
    if(item.descriptionShort.GuestMax >= serchNum){
    str += ` 
    <div class="row-36 mb-6 mb-md-8">
    <div class="col-36-4 col-md-36-12">
        <div class="imgCard roomPicCard">
            <img src=${item.imageUrl} alt="">
            <a href="" class="h2 text-light">${item.name}</a>
        </div>
    </div>
    <div class="card col-36-8 col-md-36-12 mt-md-5">
        <div class="container-48 h-100 d-flex flex-column px-0 ">
        <h3 class="h2 bold">${item.name}</h3>
        <div class="row-48 mt-3 card_body">
            <div class="col-48-6 col-md-48-12 d-flex flex-column justify-content-between">
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
                <div class="container-12 px-0 roomAmenities mt-md-5">
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
            <div class="d-flex flex-column col-48-5 col-md-48-12 ml-auto justify-content-between pt-3">
                  <ul class="align-self-end">
                      <li class="display-2 mr-2 d-flex align-items-center"><span class="small">平日每晚</span>$${item.normalDayPrice.toLocaleString()}</li>
                      <li class="display-2 mr-2 mt-4 d-flex align-items-center"><span class="small">假日每晚</span>$${item.holidayPrice.toLocaleString()}</li>
                  </ul>
                  <div class="align-self-end d-flex align-self-sm-stretch mt-md-5 justify-content-sm-between">
                      <a href="" class="btn btn-more bg-light text-dark mr-2" data-roomno=${roomNo} data-roomnd=${
      item.id
    }>MORE +</a>
                      <a href="booking.html" class="btn text-light bg-dark btn-bookNow" data-roomno=${roomNo} data-roomnd=${
      item.id
    }>BOOK NOW</a>
                  </div>

            </div>
        </div>
        </div>
        
        
    </div>

</div>`;

      }
      //否則全部加入渲染字串
    
    //用來放在class=data-roomNo 代表房間編號,可以辨識按more按紐要讀取roomDetailArray中哪一筆資料
    roomNo++;
  });
  //進行第一次頁面渲染
  console.log(this);
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
  //字串的replace並不會改變字串本身
  loading_screen_classList = loading_screen_classList.replace("d-block","d-none");
  console.log(loading_screen_classList);
  loading_screen.setAttribute("class",loading_screen_classList);
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
//此用jQuery
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
