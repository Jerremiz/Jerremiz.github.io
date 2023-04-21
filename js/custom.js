//get请求
$.ajax({
    type: 'get',
    url: 'https://apis.map.qq.com/ws/location/v1/ip',
    data: {
        key: 'DXSBZ-DV6WH-P6DD3-WT7BA-DR6OV-TGBAX',
        output: 'jsonp',
    },
    dataType: 'jsonp',
    success: function (res) {
        ipLoacation = res;
    }
})

function getDistance(e1, n1, e2, n2) {
    const R = 6371
    const { sin, cos, asin, PI, hypot } = Math
    let getPoint = (e, n) => {
        e *= PI / 180
        n *= PI / 180
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
    }

    let a = getPoint(e1, n1)
    let b = getPoint(e2, n2)
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    let r = asin(c / 2) * 2 * R
    return Math.round(r);
}

let hasExecuted = false;

function showWelcome() {

    let dist = getDistance(115.27179, 22.81234, ipLoacation.result.location.lng, ipLoacation.result.location.lat); //这里换成自己的经纬度
    let pos = ipLoacation.result.ad_info.nation + " " + ipLoacation.result.ad_info.province + " " + ipLoacation.result.ad_info.city + " " + ipLoacation.result.ad_info.district;
    let ip = ipLoacation.result.ip;
    let posdesc;
    // //根据国家、省份、城市信息自定义欢迎语
    switch (ipLoacation.result.ad_info.nation) {
      case "日本":
        posdesc = "よろしく，一起去看樱花吗";
        break;
      case "美国":
        posdesc = "";
        break;
      case "英国":
        posdesc = "想同你一起夜乘伦敦眼";
        break;
      case "俄罗斯":
        posdesc = "干了这瓶伏特加！";
        break;
      case "法国":
        posdesc = "C'est La Vie";
        break;
      case "德国":
        posdesc = "Die Zeit verging im Fluge.";
        break;
      case "澳大利亚":
        posdesc = "一起去大堡礁吧！";
        break;
      case "加拿大":
        posdesc = "拾起一片枫叶赠予你";
        break;
      case "中国":
        pos = ipLoacation.result.ad_info.province + " " + ipLoacation.result.ad_info.city + " " + ipLoacation.result.ad_info.district;
        posdesc = "";
        break;
      default:
        posdesc = "带我去你的国家逛逛吧";
        break;
    }

    //根据本地时间切换欢迎语
    let timeChange;
    let date = new Date();
    if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "<span>上午好</span>，一日之计在于晨！";
    else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "<span>中午好</span>，该摸鱼吃午饭了 ";
    else if (date.getHours() >= 13 && date.getHours() < 15) timeChange = "<span>下午好</span>，懒懒地睡个午觉吧！";
    else if (date.getHours() >= 15 && date.getHours() < 16) timeChange = "<span>三点几啦</span>，一起饮茶呀！";
    else if (date.getHours() >= 16 && date.getHours() < 19) timeChange = "<span>夕阳无限好！</span>";
    else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>晚上好</span>，夜生活嗨起来！";
    else timeChange = "夜深了，早点休息，少熬夜 ";

    try {
        //自定义文本和需要放的位置
        document.getElementById("welcome-info").innerHTML =
            `<b><center>--- 🎉 Welcome 🎉 ---</center><center>欢迎 <span style="color:#5ea6e5">${pos}</span> 的小伙伴</center><center>${timeChange}</center><center>您现在距离站长约 <span style="color:#5ea6e5">${dist}</span> 公里</center><center>${posdesc}</center></b>`; //<center>当前的IP地址为： <span style="color:#5ea6e5">${ip}</span></center>
    } catch (err) {
        // console.log("Pjax无法获取#welcome-info元素")
    }
    if (!hasExecuted) sendMsgToWXWork();//推送

    //企业微信群机器人推送
    function sendMsgToWXWork() {
      const send_url = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8023261b-787a-4ae3-994c-cc8148dfd256";
      const send_data = {
        "msgtype": "markdown", // 消息类型，此时固定为markdown
        "markdown": {
          "content": 
            `**<font color=\"info\">${pos}</font> 的小伙伴来访**\n**距离约 <font color=\"info\">${dist}</font> KM**\n**IP：<font color=\"info\">${ip}</font>**\n${posdesc}`,
        }
      };

      fetch(send_url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
      }).then(response => {
        console.log('Response:', response);
      }).catch(error => {
        console.error('Error:', error);
      });
      hasExecuted = true;
    }
    //


}
window.onload = showWelcome;

// 如果使用了pjax在加上下面这行代码
document.addEventListener('pjax:complete', showWelcome);




/* 页脚计时器 start */
var now = new Date();
function createtime() {
  // 当前时间
  now.setTime(now.getTime() + 1000);
  var start = new Date("08/01/2022 00:00:00"); // 旅行者1号开始计算的时间
  var dis = Math.trunc(23400000000 + ((now - start) / 1000) * 17); // 距离=秒数*速度 记住转换毫秒
  var unit = (dis / 149600000).toFixed(6);  // 天文单位
  let currentTimeHtml = "";
  (currentTimeHtml = `<div style="font-size:13px;font-weight:bold">旅行者 1 号当前距离地球 ${dis} 千米</div>`),
    document.getElementById("workboard") &&
    (document.getElementById("workboard").innerHTML = currentTimeHtml);
}
// 设置重复执行函数，周期1000ms
setInterval(() => {
  createtime();
}, 1000);

/*页脚计时器 end */


window.onscroll = percent;// 执行函数
// 页面百分比
function percent() {
    let a = document.documentElement.scrollTop || window.pageYOffset, // 卷去高度
        b = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight, // 整个网页高度
        result = Math.round(a / b * 100), // 计算百分比
        up = document.querySelector("#go-up") // 获取按钮

    if (result <= 95) {
        up.childNodes[0].style.display = 'none'
        up.childNodes[1].style.display = 'block'
        up.childNodes[1].innerHTML = result + '<span>%</span>';
    } else {
        up.childNodes[1].style.display = 'none'
        up.childNodes[0].style.display = 'block'
    }
}


/* 禁用f12与按键防抖 start */
// 防抖全局计时器
let TT = null;    //time用来控制事件的触发
// 防抖函数:fn->逻辑 time->防抖时间
function debounce(fn, time) {
  if (TT !== null) clearTimeout(TT);
  TT = setTimeout(fn, time);
}

// 复制提醒
document.addEventListener("copy", function () {
  debounce(function () {
    new Vue({
      data: function () {
        this.$notify({
          title: "复制成功🍬",
          message: "若要转载最好保留原文链接哦！",
          position: 'top-left',
          offset: 50,
          showClose: true,
          type: "success",
          duration: 5000
        });
      }
    })
  }, 300);
})


// f12提醒但不禁用
document.onkeydown = function (e) {
  if (123 == e.keyCode || (e.ctrlKey && e.shiftKey && (74 === e.keyCode || 73 === e.keyCode || 67 === e.keyCode)) || (e.ctrlKey && 85 === e.keyCode)) {
    debounce(function () {
      new Vue({
        data: function () {
          this.$notify({
            title: "被发现啦😜",
            message: "扒源记住要遵循GPL协议！",
            position: 'top-right',
            offset: 50,
            showClose: true,
            type: "warning",
            duration: 5000
          });
        }
      })
    }, 300);
  }
};
/* 禁用f12与按键防抖 end */


