function getTime() {
    try {
        var a = new Date().getTime();
    }catch (e) {
        //_czc.push(['_trackEvent', '十一活动', '获取时间异常', '异常提交', '', '']);
        a = 0
    }finally {
        return a;
    }
}
starTime  = getTime();

function getTotalTime() {
    var end = getTime();
    var delta = ((starTime && end) ? (end - starTime) : 0)/1000;
    return delta;
}
coocaaApp.bindEvents("menubutton", function () {
    console.log("this menuButton>>>>>>>>>new>>>>>>>>>")
})
coocaaApp.bindEvents("homebutton", function () {
    navigator.app.exitApp();
})
coocaaApp.bindEvents("backbuttondown", function () {
    backButtonFunc();
})
coocaaApp.bindEvents("resume", function () {

    var nowTime = new Date().getTime();
    var clickTime = $("#answerBtn").attr("ctime");//记录启小程序的时间
    console.log(clickTime);
    if(clickTime != 'undefined' && (nowTime - clickTime < 1000)) {
        console.log('无效的resume事件+不处理');
        return false;
    } else {
        console.log("查询游戏结果");
    }
})

coocaaApp.ready(function () {
    checkVersion();
    actionId = getUrlParam("id");
    coocaaApp.getTvSource(function (msg) {
        tvsource = msg.tvsource;
        deviceInfo = msg.deviceInfo;
        console.log(tvsource);
        coocaaApp.haslogin(function (msg) {//调用后可获取loginstatus、tencentWay、user_flag、user_info、access_token、login_type、vuserid、openid
            // console.log(JSON.stringify(msg));
            loginstatus = msg.loginstatus;
            if (loginstatus == "true") {
                userInfo = msg.user_info;
                access_token = msg.access_token;
                vuserid = msg.vuserid;
                openid = userInfo.open_id;
            }
            showPage();
        });
    });
    listenUserChange();
    initBtn();
})
coocaaApp.triggleButton = function () {
    // map = new coocaakeymap($(".coocaabtn"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
}


function backButtonFunc(){
    if ($("#rulePage").css("display") == "block"){
        console.log("规则页面返回+回到主活动页");
    }else if($("#myawardPage").css("display") == "block"){
        if ($("#awardDialogPage").css("display") == "block"){
            console.log("奖励弹窗页面返回+回到奖励页面");
            $("#awardDialogPage").css("display","none");
            $(".secondDialog").css("display","none");
            needSelectAllowance = (loginstatus == "true")?true:false;
            selectMyAllowanceNum(1, needSelectAllowance);
            getMyaward();
        }else{
            console.log("奖励页面返回+回到主活动页");
            $("#myawardPage").css("display","none");
            $("#mainPage").css("display","block");
            $("#awardGetFail").css("display","none");
            map = new coocaakeymap($(".coocaabtn"), $("#myawardBtn"), "btnFocus", function() {}, function(val) {}, function(obj) {});
        }
    }else if($("#billboardPage").css("display") == "block"){
        console.log("榜单页面返回+回到主活动页");
    }else{
        console.log("出挽留弹窗");
        //navigator.app.exitApp();
    }
}

function initBtn() {
    console.log("=============");
    $(".listItem").unbind("itemFocus").bind("itemFocus",function () {
        var _curIndex = $(".listItem").index($(this));
        var x = 0;
        var _h1 = $("#gameing").outerHeight(true);
        var _h2 = $("#waitgame").outerHeight(true);
        var _h3 = $(".listbox :eq(0)").outerHeight(true);
        console.log(_h1+"==="+_h2+"==="+_h3);
        var h = (activeFlag == "0")?_h1:_h2;

        x = parseInt(Math.floor(_curIndex/3))*_h3+h;
        console.log(x);
        // $("#mainPage").css("transform", "translate3D(0, -" + x + "px, 0)");
        $("#mainPage").stop(true, true).animate({scrollTop: x}, {duration: 0,easing: "swing"});
    })

    $(".secondBox").unbind("itemFocus").bind("itemFocus",function () {
        $("#mainPage").stop(true, true).animate({scrollTop: 0}, {duration: 0,easing: "swing"});
    })
    $(".operationblock").unbind("itemClick").bind('itemClick', function () {
        var _thisIndex = $(".operationblock").index($(this));

    });
    $("#myawardBtn").unbind("itemClick").bind('itemClick', function () {
        console.log("点击了我的奖励");
        // var _dateObj = {
        //     "page_name": "活动主页面",
        //     "page_state": "加载成功",
        //     "activity_name": "2019十一活动",
        //     "activity_type": "OKR活动",
        //     "button_name": "我的奖励",
        //     "activity_id": actionId,
        //     "open_id":openid
        // };
        // sentLog("web_button_clicked_new", _dateObj);
        // _czc.push(['_trackEvent', '十一活动','点击我的奖励','' , '', '']);
        getAllofMyaward();
    });
    $("#ruleBtn").unbind("itemClick").bind('itemClick', function () {
        $("#rulePage").show();
        map = new coocaakeymap($("#rulePage"), null, "btn-focus", function () {}, function (val) {}, function (obj) {});
    });
}
function showPage() {
    var ajaxTimeoutOne = $.ajax({
        type: "post",
        async: true,
        url: adressIp + "/building/v2/web/init",
        data: {
            id: actionId,
            MAC: deviceInfo.mac,
            cChip: deviceInfo.chip,
            cModel: deviceInfo.model,
            cUDID: deviceInfo.activeid,
            source: tvsource,
            cOpenId: openid,
            cNickName: userInfo.nick_name
        },
        dataType: "json",
        // timeout: 20000,
        success: function (data) {
            console.log("----------" + JSON.stringify(data));
            if (data.code == 50100) {

            }else{
                map = new coocaakeymap($(".coocaabtn"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
            }
        },
        error: function (error) {
            console.log("-----------访问失败---------" + JSON.stringify(error));
        },
        complete: function (XMLHttpRequest, status) {
            console.log("-------------complete------------------" + status);
            if (status == 'timeout') {
                ajaxTimeoutOne.abort();
            }
            map = new coocaakeymap($(".coocaabtn"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
        }
    });
}

//获取我的任务信息
function getMyTasksList(firstEnter) {
    var ajaxTimeoutOne = $.ajax({
        type: "post",
        async: true,
        timeout: 10000,
        dataType: 'json',
        url: adressIp+'/building/v2/web/user-task-result',
        data: {
            id:actionId,userKeyId:userKeyId,source:tvsource
        },
        success: function (data) {
            console.log("任务信息=========================="+JSON.stringify(data));
            if (data.code == "50100") { //服务器返回正常
                $("#jumpZone").html("");
                var taskOrder = ["jump", "video", "videoAndAsk"];
                var taskList = data.data;
                var missionBoxNum = 0;
                var overTask = 0;
                var tabInner = "";
                for (var i = 0; i < 3; i++) {
                    if (taskList[taskOrder[i]] != undefined) {
                        for (var j = 0; j < taskList[taskOrder[i]].length; j++) {
                            var extendInfo = "taskId='" + taskList[taskOrder[i]][j].taskId + "' " +
                                "taskName='" + taskList[taskOrder[i]][j].taskName + "' " +
                                "taskType='" + taskOrder[i] + "' " +
                                "remainingNumber='" + taskList[taskOrder[i]][j].remainingNumber + "' " +
                                "countdown='" + taskList[taskOrder[i]][j].countdown + "' " +
                                "jumpBgImgUrl='" + taskList[taskOrder[i]][j].jumpBgImgUrl + "' " +
                                "jumpImgUrl='" + taskList[taskOrder[i]][j].jumpImgUrl + "' " +
                                "jumpRemindImgUrl='" + taskList[taskOrder[i]][j].jumpRemindImgUrl + "' ";
                            var action = "";
                            if (taskOrder[i] == "jump") {
                                action = "action=" + taskList[taskOrder[i]][j].param;
                            } else if (taskOrder[i] == "video") {
                                action = "url=" + taskList[taskOrder[i]][j].param;
                            }

                            var tabItem = '<div class="operationblock coocaabtn mission" ' + extendInfo + action + ' style="background-image:url(' + taskList[taskOrder[i]][j].imgUrl + ')"></div>';
                            tabInner += tabItem;
                        }
                    }
                }
                $("#jumpZone").append(tabInner);

            } else {
                $("#mainPage").show();
                console.log('获取任务接口异常');
            }
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        },
        complete: function (XMLHttpRequest, status) {
            console.log("-------------complete------------------" + status);
            if (status == 'timeout') {
                ajaxTimeoutOne.abort();
            }
        }
    });
}
//加载立即检测版本
function checkVersion() {
    console.log("activityCenterVersion======"+activityCenterVersion);
    if (activityCenterVersion < 103015) {
        console.log("版本不满足，下载最新apk");
        coocaaosapi.createDownloadTask(
            "https://apk-sky-fs.skysrt.com/uploads/20190403/20190403141921936543.apk",
            "A80A891472EF2F1AA7E6A9139AAC2BAD",
            "活动中心",
            "com.coocaa.activecenter",
            "26417",
            "http://img.sky.fs.skysrt.com//uploads/20170415/20170415110115834369.png",
            function () {
            },
            function () {
            });
    }
    if (browserVersion < 200043) {
        console.log("browserversion======"+browserVersion);
        browserVersionLow = true;
        coocaaosapi.createDownloadTask(
            "https://apk-sky-fs.skysrt.com/uploads/20190902/20190902110319867122.apk",
            "F89FBDC675F313CA4C8E299BE83B979F",
            "活动浏览器",
            "com.coocaa.app_browser",
            "26423",
            "http://img.sky.fs.skysrt.com//uploads/20170415/20170415110115834369.png",
            function () {
            },
            function () {
            })
    }
}

function getAlertInfo() {
    var ajaxTimeoutOne = $.ajax({
        type: "post",
        async: true,
        timeout: 10000,
        dataType: 'json',
        url: adressIp+'/building/decade/alert',
        data: {
            id: actionId,
            MAC: deviceInfo.mac,
            cChip: deviceInfo.chip,
            cModel: deviceInfo.model,
            cUDID: deviceInfo.activeid,
            source: tvsource,
            cOpenId: openid,
            cNickName: userInfo.nick_name
        },
        success: function (data) {
            console.log("openid==" + openid)
            console.log("弹窗信息==========================" + JSON.stringify(data));
            if (data.code == "50100") { //服务器返回正常

            } else {
                console.log('获取弹窗信息接口异常');
            }
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        },
        complete: function (XMLHttpRequest, status) {
            console.log("-------------complete------------------" + status);
            if (status == 'timeout') {
                ajaxTimeoutOne.abort();
            }
        }
    });
}
function showAwardInfo() {
    $("#gameMapNewsul").html("");
    $.ajax({
        type: "get",
        async: true,
        url: adressIp + "/building/v2/web/tv-new",
        data: {id: actionId},
        dataType: "json",
        // timeout: 20000,
        success: function (data) {
            console.log("ssss========" + JSON.stringify(data))
            //showAwardlist("#gameMapNews", "#gameMapNewsul");
        },
        error: function (error) {
            console.log("-----------访问失败---------" + JSON.stringify(error));
        }
    });
}
function showAwardlist(box, inner) {
    clearInterval(marqueeInterval);
    var boxHeight = $(box).height();
    var listHeight = $(inner).height() || $("#gameMapNewsul li").length * 22;
    var screenNum = Math.ceil(listHeight / boxHeight);
    console.log("---" + boxHeight + "---" + listHeight + "----" + screenNum + "---")
    var a = 1;
    if (screenNum > 1) {
        marqueeInterval = setInterval(marquee, 3000);
    }
    function marquee() {
        $(inner).css("transform", "translate3D(0, -" + a * boxHeight + "px, 0)");
        a++;
        if (a == screenNum) {
            a = 0
        }
    }
}
//完成任务时，增加机会接口:
function addChance(taskId, askResult) {
    //console.log("taskType:"+taskType+",taskId:"+taskId);
    $.ajax({
        type: "post",
        async: true,
        timeout: 10000,
        url: adressIp+"/building/v2/web/task/finish-task",
        data: {
            taskId:taskId,
            activeId:actionId,
            userKeyId:userKeyId,
            MAC: deviceInfo.mac,
            cChip: deviceInfo.chip,
            cModel: deviceInfo.model,
            cUDID: deviceInfo.activeid,
            askResult: askResult
        },
        dataType: "json",
        success: function(data) {
            console.log("------------addChanceWhenFinishTask----result-------------"+JSON.stringify(data));
            if(data.code == 50100){}else{}
        },
        error: function(error) {
            console.log("--------访问失败" + JSON.stringify(error));
        }
    });
}
//自定义数据
function sentLog(eventid, datalist) {
    var data = JSON.stringify(datalist);
    coocaaosapi.notifyJSLogInfo(eventid, data, function (message) {console.log(message);}, function (error) { console.log(error);});
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2], 'utf-8');
    return null;
}










// 奖励部分
function getAllofMyaward(){
    arr17 =[];//津贴奖
    arr7 =[];//红包将
    arr2 =[];//实物奖
    arr3 =[];//卡密奖
    arr22 =[];//第三方优惠券
    arr23 =[];//黄金红包奖
    document.getElementById("#myawardPage").innerHTML = "";
    $("#myawardPage").css("display", "block");
    needSelectAllowance = (loginstatus == "true")?true:false;
    console.log(needSelectAllowance);
    selectMyAllowanceNum(1, needSelectAllowance);
    getMyaward(actionId);
    getMyaward(actionId2);
}
function selectMyAllowanceNum(state, need) {
	//need为false的时候，state不可能为2
    console.log(need);
	if(need) {
	    console.log("获取津贴");
		var allowanceObj = {};
		var ajaxTimeoutOne = $.ajax({
			type: "GET",
			async: true,
			url: allowanceUrl,
			data: {
				clientId: allowanceClientId,
				authenticationType: "openid",
				authenticationValue: openid,
				currentTimestamp: new Date().getTime()
			},
			dataType: "jsonp",
			jsonp: "callback",
			success: function(data) {
				console.log(JSON.stringify(data));
                myAllowanceNum = allowanceObj.data.totalSubsidy;
			},
			error: function() {
				console.log("查看津贴出错");
                myAllowanceNum = 0;
			},
			complete: function(XMLHttpRequest, status) {
				if(status == 'timeout') {
					ajaxTimeoutOne.abort();
				}
				if(state == 2) {
					console.log("将津贴的值赋给津贴奖品" + myAllowanceNum);
					$("#allOfMyAllowance .allowanceNumber").html(myAllowanceNum);
                    $("#allOfMyAllowance .allowanceNumber").text(myAllowanceNum);
				} else {
					hasGotAllowance = "3";
					//dealAfterRequire();
                    $.getJSON('js/award2.json', function(data) {
                        myAllowanceNum = data.data.totalSubsidy;
                        dealAfterRequire();
                    });
				}
			}
		});
	} else {
	    console.log("不用获取津贴");
		hasGotAllowance = "3";
		dealAfterRequire();
	}
}

function getMyaward(id) {
	console.log("----getMyaward----");
	var ajaxTimeoutOne = $.ajax({
		type: "get",
		async: true,
		timeout: 10000,
		dataType: 'json',
		url: adressIp + "/building/decade/u-award",
		data: {
			"clientType": "web",
			"id": id,
			"cUDID": deviceInfo.activeid,
			"MAC": deviceInfo.mac,
			"cModel": deviceInfo.model,
			"cChip": deviceInfo.chip,
			"cOpenId": openid
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			dealAwardData(id,data);
		},
		error: function() {
			console.log("something is wrong in getMyaward function");
		},
		complete: function(XMLHttpRequest, status) {
			if(status == 'timeout') {
				ajaxTimeoutOne.abort();
			}
            if(id==actionId){
                hasGotActionaward = "3";
                $.getJSON('js/award3.json', function(data) {
                    dealAwardData(id,data);
                    dealAfterRequire();
                });
            }else{
                hasGotPreheataward = "3";
                $.getJSON('js/award3.json', function(data) {
                    dealAwardData(id,data);
                    dealAfterRequire();
                });
            }
			//dealAfterRequire();
		}
	});
}
function dealAwardData(id,obj){
    if(id==actionId){
        console.log("获取到主活动奖励数据"+JSON.stringify(data));
        for(var i = 0; i < obj.data.list.length; i++) {
            var _time = obj.awards.data.list[i].awardTime;
            _time = _time.substr(0, 10);
            var objItem = {
                "awardName": obj.data.list[i].awardName,
                "awardTime": _time,
                "awardType": obj.data.list[i].awardTypeId,
                "awardUrl": obj.data.list[i].awardUrl,
                "state": obj.data.list[i].awardExchangeFlag,
                "userkeyId": obj.data.list[i].userKeyId,
                "awardId": obj.data.list[i].awardId,
                "rememberId": obj.data.list[i].lotteryAwardRememberId,
                "activeId": obj.data.list[i].activeId,
                "awardInfo": obj.data.list[i].awardInfo
            }
            if (obj.data.list[i].awardTypeId == "17"){
                console.log("津贴");
                objItem.price = data.data[i].awardInfo.price;
                arr0.push(objItem);
            }
            if (obj.data.list[i].awardTypeId == "7"){
                console.log("红包");
                arr1.push(objItem);
            }
            if (obj.data.list[i].awardTypeId == "2") {
                console.log("实物奖");
                if (obj.data.list[i].awardExchangeFlag == 1) {
                    if (obj.data.list[i].awardAddressEntity.userProvince == obj.data.list[i].awardAddressEntity.userCity) {
                        objItem.awardAddress = obj.data.list[i].awardAddressEntity.userCity + obj.data.list[i].awardAddressEntity.userArea + obj.data.list[i].awardAddressEntity.userAddress;
                    } else {
                        objItem.awardAddress = obj.data.list[i].awardAddressEntity.userProvince + obj.data.list[i].awardAddressEntity.userCity + obj.data.list[i].awardAddressEntity.userArea + obj.data.list[i].awardAddressEntity.userAddress;
                    }
                    objItem.userPhone = obj.data.list[i].awardAddressEntity.userPhone;
                    objItem.userName = obj.data.list[i].awardAddressEntity.receiveName;
                    objItem.receiveTime = obj.data.list[i].awardAddressEntity.receiveTime;
                }
                arr2.push(objItem);
            }
            if(obj.data.list[i].awardTypeId == "3"){
                console.log("卡密奖");
                console.log(obj.data.list[i].exchangeLabel);
                objItem.exchangeLabel = obj.data.list[i].exchangeLabel||"";
                arr3.push(objItem);
            }
            if(obj.data.list[i].awardTypeId == "22"){
                console.log("第三方优惠券");
                objItem.thirdType =JSON.parse(obj.data.list[i].awardInfo).type;
                arr4.push(objItem);
            }
            if(obj.data.list[i].awardTypeId == "23"){
                console.log("黄金红包");
                arr5.push(objItem);
            }
        }
    }else{
        console.log("获取到预热活动奖励数据"+JSON.stringify(data));
        if (obj.data.list[i].awardTypeId == "17"){
            console.log("津贴");
            objItem.price = data.data[i].awardInfo.price;
            arr0.push(objItem);
        }
    }
}

function dealAfterRequire() {
	console.log("----dealAfterRequire----");
	console.log(arr17);
    console.log(arr7);
    console.log(arr2);
    console.log(arr3);
    console.log(arr22);
    console.log(arr23);
    $("#myAwardBox").css("display", "none");
    $("#noAwardBox1").css("display", "none");
    $("#noAwardBox2").css("display", "none");
	if(hasGotActionaward == 3 && hasGotAllowance == 3 && hasGotPreheataward == 3) {
		document.getElementById("myawardPage").innerHTML = "";
		var awardLength = arr17.length+arr7.length+arr2.length+arr3.length+arr22.length+arr23.length+allowanceNum;
		if(awardLength== 0) {
			console.log("无奖励");
			if (activeFlag==0) {
				_curFocusId = "noAwardBox2";
				$("#noAwardBox2").css("display", "block");
			} else{
				_curFocusId = "noAwardBox1";
				$("#noAwardBox1").css("display", "block");
			}
		} else {
            console.log("有奖励");
            $("#myAwardBox").css("display", "block");
            if(arr17.length != 0||allowanceNum != 0){
                var eachAwardBox = '<div id="eachBox17" class="awardTabBox"><div class="awardTabName lab17" id="eachTitle17"></div><div class="awardTabs" id="eachTabs17"></div></div>';
                $("#myAwardBox").append(eachAwardBox);
                if(loginstatus&&allowanceNum>0){
                    $("#eachTabs17").empty();
                    var awardDivBox = '<div id="allowanceHasGot" awardType="17" awardState="1" class="myAwards coocaa_btn2 award1"><div class="myawardsImg fullChild"><div class="cardName">' + allowanceNum + '</div><div class="awardbtns"><div class="myawardsBtn button5"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                    $("#eachTabs17").append(awardDivBox);
                }else{
                    var curDivId = "allowanceHasUsed";
                    if (obj.state == 0) {
                        var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><span class="cardName">' + (JSON.parse(obj.awardInfo).price || obj.awardInfo.price) + '</span></div><div class="awardbtns"><div class="myawardsBtn button7"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                        $("#eachTabs17").append(awardDivBox);
                    } else{
                        if(document.getElementById(curDivId)) {
                            console.log("该元素已存在 ，直接累加津贴数");
                            var _curAllBonus = 0;
                            if(arr17.awardInfo != null && arr17.awardInfo != undefined) {
                                _curAllBonus = JSON.parse(arr17.awardInfo).price || arr17.awardInfo.price;
                            }
                            console.log($("#allowanceHasGot .cardName").html());
                            _curAllBonus = toDecimal($("#allowanceHasGot .cardName").html()) + toDecimal(_curAllBonus);
                            console.log(_curAllBonus);
                            $("#allowanceHasGot .cardName").html(_curAllBonus);
                        } else {
                            console.log("该元素不存在，创建该元素，显示金额");
                            var awardDivBox = '<div id="allowanceHasGot" awardType="17" awardState="1" class="myAwards coocaa_btn2 award1"><div class="myawardsImg fullChild"><div class="cardName">' + (JSON.parse(obj.awardInfo).price || obj.awardInfo.price) + '</div><div class="awardbtns"><div class="myawardsBtn button5"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                            $("#eachTabs17").append(awardDivBox);
                        }
                    }
                }
            }
            if(arr7.length != 0){
                var eachAwardBox = '<div id="eachBox7" class="awardTabBox"><div class="awardTabName lab7" id="eachTitle7"></div><div class="awardTabs" id="eachTabs7"></div></div>';
                $("#myAwardBox").append(eachAwardBox);

                var curDivId = "redHasGot";
                console.log(obj.state);
                if (obj.state == 0) {
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><div class="cardName"><span class="onlyNum">' + (JSON.parse(obj.awardInfo).bonus || obj.awardInfo.bonus) + '</span>&nbsp;元</div></div><div class="awardbtns"><div class="myawardsBtn button3"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                    $("#eachTabs7").append(awardDivBox);
                } else if(obj.state == 1){
                    if(document.getElementById(curDivId)) {
                        console.log("该元素已存在 ，直接累加金额");
                        var _curRedBonus = 0;
                        console.log(obj.awardInfo);
                        console.log(JSON.parse(obj.awardInfo).bonus);
                        _curRedBonus = JSON.parse(obj.awardInfo).bonus || obj.awardInfo.bonus||0;
                        console.log(toDecimal(_curRedBonus));
                        console.log($("#redHasGot .onlyNum").html());
                        var _curRedNumber = toDecimal($("#redHasGot .onlyNum").html()) + toDecimal(_curRedBonus);
                        $("#redHasGot .onlyNum").html(_curRedNumber);
                    } else {
                        console.log("该元素不存在，创建该元素，显示金额");
                        var awardDivBox = '<div id="redHasGot" awardType="7" awardState="1" class="myAwards coocaa_btn2 award1"><div class="myawardsImg fullChild"><div class="cardName"><span class="onlyNum">' + (JSON.parse(obj.awardInfo).bonus || obj.awardInfo.bonus) + '</span>&nbsp;元</div><div class="awardbtns"><div class="myawardsBtn button3"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                        $("#eachTabs7").append(awardDivBox);
                    }
                }
            }
            if(arr2.length != 0){
                var eachAwardBox = '<div id="eachBox2" class="awardTabBox"><div class="awardTabName lab2" id="eachTitle2"></div><div class="awardTabs" id="eachTabs2"></div></div>';
                $("#myAwardBox").append(eachAwardBox);
                if (obj.state == 0) {
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="'+obj.awardUrl+'"/></div><div class="cardName">恭喜获得<br/>' + obj.awardName + '</div></div><div class="awardbtns"><div class="myawardsBtn button1"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                } else{
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award1" awardAddress="' + obj.awardAddress + '" userPhone="' + obj.userPhone + '" userName="' + obj.userName + '" receiveTime="' + obj.receiveTime + '"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="'+obj.awardUrl+'"></div><div class="cardName">恭喜获得<br/>' + obj.awardName + '</div></div><div class="awardbtns"><div class="myawardsBtn button5"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                }
                $("#eachTabs2").append(awardDivBox);
            }
            if(arr3.length != 0){
                var eachAwardBox = '<div id="eachBox3" class="awardTabBox"><div class="awardTabName lab3" id="eachTitle3"></div><div class="awardTabs" id="eachTabs3"></div></div>';
                $("#myAwardBox").append(eachAwardBox);
                if(obj.state == 0) {
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="'+obj.awardUrl+'"/></div><div class="cardName">恭喜获得<br/>' + obj.awardName + '</div></div><div class="awardbtns"><div class="myawardsBtn button1"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                } else {
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' exchangeLabel="' + obj.exchangeLabel + '" class="myAwards coocaa_btn2 award1"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="'+obj.awardUrl+'"/></div><div class="cardName">恭喜获得<br/>' + obj.awardName + '</div></div><div class="awardbtns"><div class="myawardsBtn button5"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                }
                $("#eachTabs3").append(awardDivBox);
            }
            if(arr22.length != 0){
                var eachAwardBox = '<div id="eachBox22" class="awardTabBox"><div class="awardTabName lab22" id="eachTitle22"></div><div class="awardTabs" id="eachTabs22"></div></div>';
                $("#myAwardBox").append(eachAwardBox);
                if(obj.thirdType == "xc"){
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/xc.png"/></div><span class="cardName">恭喜获得<br/>' + obj.awardName + '</span></div><div class="awardbtns"><div class="myawardsBtn button7"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                }else if(obj.thirdType == "sz"){
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/sz.png"/></div><span class="cardName">恭喜获得<br/>' + obj.awardName + '</span></div><div class="awardbtns"><div class="myawardsBtn button7"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                }else{
                    var awardDivBox = '<div id="eachAward' + i + '" awardType="' + obj.awardType + '" awardState="' + obj.state + '" rememberId="' + obj.rememberId + '" awardId="' + obj.awardId + '" userkeyId="' + obj.userkeyId + '" awardName="' + obj.awardName + '" awardTime="' + obj.awardTime + '" activeId="' + obj.activeId + '"  awardUrl="' + obj.awardUrl + '" awardInfo=' + obj.awardInfo + ' class="myAwards coocaa_btn2 award0"><div class="myawardsImg fullChild"><div class="eachAwardImg others"><img class="fullChild" src="'+obj.awardUrl+'"/></div><span class="cardName">恭喜获得<br/>' + obj.awardName + '</span></div><div class="awardbtns"><div class="myawardsBtn button7"></div><img class="myawardsBorder" src="http://sky.fs.skysrt.com/statics/webvip/webapp/101/award/focus.png"/></div></div>';
                }
                $("#eachTabs22").append(awardDivBox);
            }
            if(arr23.length != 0){
                var eachAwardBox = '<div id="eachBox23" class="awardTabBox"><div class="awardTabName lab23" id="eachTitle23"></div><div class="awardTabs" id="eachTabs23"></div></div>';
                $("#myAwardBox").append(eachAwardBox);

            }
			$(".myAwards").css("width", parameter.awardBoxWidth);
			$(".myAwards").css("height", parameter.awardBoxHeight);
			for(var j = 0; j < $(".awardTabs").length; j++) {
				$(".awardTabs:eq(" + j + ")").find(".myAwards:last-child").attr("rightTarget", "#" + $(".awardTabs:eq(" + j + ")").find(".myAwards:last-child").attr("id"));
				var downBtnId = "";
				var upBtnId = "";
				//a:有同一类对齐奖励的上键;b:上一类奖品的上键;
				//c:有同一类对齐奖励的下键;d:下一类奖品的下键;
				//a1,b1,c1,d1:用作判断
				var a, b, c, d, a1, b1, c1, d1 = "";
				for(var k = 0; k < $(".awardTabs:eq(" + j + ")").find(".myAwards").length; k++) {
					if(k - parameter.buttonInitNum >= 0) {
						a1 = k - parameter.buttonInitNum;
					} else {
						a1 = (j == 0 ? k : a1 = $(".awardTabs:eq(" + j + ")").find(".myAwards").length + 1);
					}
					a = $(".awardTabs:eq(" + j + ")").find(".myAwards:eq(" + a1 + ")").attr("id");

					if((($(".awardTabs:eq(" + (j - 1) + ")").find(".myAwards").length - 1) % parameter.buttonInitNum) >= (k % parameter.buttonInitNum)) {
						b1 = Math.floor(($(".awardTabs:eq(" + (j - 1) + ")").find(".myAwards").length - 1) / parameter.buttonInitNum) * parameter.buttonInitNum + k;
					} else {
						b1 = $(".awardTabs:eq(" + (j - 1) + ")").find(".myAwards").length - 1;
					}
					b = $(".awardTabs:eq(" + (j - 1) + ")").find(".myAwards:eq(" + b1 + ")").attr("id");
					if(Math.floor(k / parameter.buttonInitNum) < Math.floor(($(".awardTabs:eq(" + j + ")").find(".myAwards").length - 1) / parameter.buttonInitNum)) {
						if(k + parameter.buttonInitNum < $(".awardTabs:eq(" + j + ")").find(".myAwards").length) {
							c1 = k + parameter.buttonInitNum;
						} else {
							c1 = $(".awardTabs:eq(" + j + ")").find(".myAwards").length - 1;
						}
					} else {
						c1 = $(".awardTabs:eq(" + j + ")").find(".myAwards").length + 1; //undefind
					}
					c = $(".awardTabs:eq(" + j + ")").find(".myAwards:eq(" + c1 + ")").attr("id")

					if(k % parameter.buttonInitNum < $(".awardTabs:eq(" + (j + 1) + ")").find(".myAwards").length) {
						d1 = k % parameter.buttonInitNum;
					} else {
						d1 = $(".awardTabs:eq(" + (j + 1) + ")").find(".myAwards").length - 1;
					}
					d = $(".awardTabs:eq(" + (j + 1) + ")").find(".myAwards:eq(" + d1 + ")").attr("id");
					upBtnId = a || b;
					downBtnId = c || d;
					$(".awardTabs:eq(" + j + ")").find(".myAwards:eq(" + k + ")").attr("upTarget", "#" + upBtnId);
					$(".awardTabs:eq(" + j + ")").find(".myAwards:eq(" + k + ")").attr("downTarget", "#" + downBtnId);
				}
			}
		}
		hasGotAllowance = "2";
		hasGotActionaward = "2";
        hasGotPreheataward = "2";
		buttonInitAfter(parameter.buttonInitNum);
		//console.log(_curFocusId);
		if(_curFocusId == "" || _curFocusId == null) {
			$(".myAwards:eq(0)").trigger("itemFocus");
		} else {
			if($("#" + _curFocusId).length == 0) {
				_curFocusId = "redHasGot";
			}
			console.log(_curFocusId);
			$("#" + _curFocusId).trigger("itemFocus");
		}
		map = new coocaakeymap($(".coocaa_btn2"), document.getElementById(_curFocusId), "btn-focus", function() {}, function(val) {}, function(obj) {});
	}
}
function buttonInitAfter(column) {
	console.log("----buttonInitAfter----");
	$("#myawardPage .myAwards").unbind("itemFocus").bind("itemFocus", function() {
		var _index1 = $("#myawardPage .myAwards").index($(this)); //btn是第几个
		var _index2 = $(".awardTabs").index($(this).parent()); //btn所在的盒子是第几个
		var myScrollTopValue = 0;
		console.log($(".awardTabs")[0].offsetHeight);
		for(var j = 1; j < (_index2 + 1); j++) {
			myScrollTopValue += ($(".awardTabs")[j - 1].offsetHeight+10);
		}
		var _index3 = $(".awardTabs:eq(" + _index2 + ")" + " .myAwards").index($(this));
		var _curLine = Math.floor(_index3 / column);
		var _itemHeight = $("#myawardPage .myAwards:eq(0)").outerHeight(true);
		myScrollTopValue += (_curLine == 0 ? 0 : (_curLine * _itemHeight));
		$("#myAwardBox").stop(true, true).animate({scrollTop: myScrollTopValue}, {duration: 0,easing: "swing"});
	});
	$(".myAwards").unbind("itemClick").bind("itemClick", function() {
		_curFocusId = $(this).attr("id");
		console.log(_curFocusId);
		thisAwardClick(this);
	});
	$("#noAwardBox1,#noAwardBox2").unbind("itemClick").bind('itemClick', function () {
        console.log("无奖励的点击事件");
        if ($(this).attr("id") == "noAwardBox2") {
            console.log("活动未结束+跳转首页相应位置");

        } else{
            console.log("活动已结束+不做响应");
        }
    });
}

function thisAwardClick(obj) {
	console.log("----thisAwardClick----");
	var _clickIndex = $(".myAwards").index($(obj));
	var _awardId = $(obj).attr("awardId");
	var _awardName = $(obj).attr("awardName");
	var _awardTime = $(obj).attr("awardTime");
	var _awardType = $(obj).attr("awardType");
	var _awardUrl = $(obj).attr("awardUrl");
	var _awardState = $(obj).attr("awardState");
	var _activeId = $(obj).attr("activeId");
	var _rememberId = $(obj).attr("rememberId");
	var _userkeyId = $(obj).attr("userkeyId");
	console.log(_clickIndex + "==" + _awardId + "==" + _awardName + "==" + _awardTime + "==" + _awardType + "==" + _awardUrl + "==" + _awardState + "==" + _activeId + "==" + _rememberId + "==" + _userkeyId);

	var isNeedSend = "true";
	var _dateObj = {
		"page_name": "我的奖励页",
		"button_name": "",
		"prize_name": _awardName,
		"page_state": "加载成功",
		"activity_name": "2019十一活动",
		"activity_type": "OKR活动",
		"activity_id": actionId,
		"open_id": openid
	};
	var _dateObj2 = {
		"page_name": "我的奖励奖品点击弹窗",
		"page_type": "inactivityWindows",
		"parent_page_name": "我的奖励页",
		"page_state": "",
		"prize_name": _awardName,
		"activity_name": "2019十一活动",
		"activity_type": "OKR活动",
		"activity_id": actionId,
		"open_id": openid
	};
	if(_awardType == 2) {
		_dateObj.button_name = "实物奖励";
		_dateObj2.page_state = "实物奖励";
		if(_awardState == 0) {
			console.log("点击了未领取的实体奖");
			$("#awardDialogPage").css("display","block");
			$(".myawardDialogBg").css("display","none");
			$("#entityNotGet").css("display","block");
			$("#entityInfo1").html("奖品名称:&nbsp;&nbsp;" + _awardName);
            $("#entityInfo2").html("获得时间:&nbsp;&nbsp;" + _awardTime);
			map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("entityQrcode"), "btnFocus", function() {}, function(val) {}, function(obj) {});
			var enstr = enurl + "activeId=" + _activeId + "&rememberId=" + _rememberId + "&userKeyId=" + _userkeyId + "&open_id=" + openid;
        	drawQrcode("entityQrcode2", enstr, 190);
		} else {
			console.log("点击了已领取的实体奖");
			var _awardAddress = $(obj).attr("awardAddress");
            var _userPhone = $(obj).attr("userPhone");
            var _userName = $(obj).attr("userName");
            var _receiveTime = $(obj).attr("receiveTime");
			$("#awardDialogPage").css("display","block");
			$(".myawardDialogBg").css("display","none");
			$("#entityHasGot").css("display","block");
			_receiveTime = _receiveTime.substr(0, 10);
			$("#hasGotInfo1").html("奖品名称:&nbsp;&nbsp;" + _awardName);
            $("#hasGotInfo2").html("获得时间:&nbsp;&nbsp;" + _receiveTime);
            $("#hasGotInfo3").html("收货人:&nbsp;&nbsp;" + _userName);
            $("#hasGotInfo4").html("收货电话:&nbsp;&nbsp;" + _userPhone);
            $("#hasGotInfo5").html("收货地址:&nbsp;&nbsp;" + _awardAddress);
			map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("hasGotInfo4"), "btnFocus", function() {}, function(val) {}, function(obj) {});
		}
	}
	if(_awardType == 3) {
		var _awardInfoStr = $(obj).attr("awardInfo");
		var _awardInfoObj = JSON.parse(_awardInfoStr);
		var _exchangeLabel = $(obj).attr("exchangeLabel");
		_dateObj.button_name = "第三方应用卡密";
		_dateObj2.page_state = "第三方应用卡密";
		console.log(_awardInfoStr);
        console.log(_awardInfoObj.apkId);
		$("#thirdInfo1").html("奖品名称:&nbsp;&nbsp;" + _awardName);
    	$("#thirdInfo2").html("获得时间:&nbsp;&nbsp;" + _awardTime);
    	$("#thirdInfo5").html(_exchangeLabel);

		if(_awardState == 0) {
			console.log("点击了未领取的卡密奖");
            $("#thirdHasGotBtn").attr("apkid",_awardInfoObj.apkId);
            if (_awardInfoObj.apkId == "0"){
                $("#thirdHasGotBtn .awardBtnName").html("知道了");
            }else{
                $("#thirdHasGotBtn .awardBtnName").html("去使用");
            }
			sendPrizes(_awardId, _rememberId, _awardType, _userkeyId, _activeId, tvsource,2);
		} else {
			console.log("点击了已领取的卡密奖");
            $("#thirdHasGotBtn").attr("apkid",_awardInfoObj[0].apkId);
            if (_awardInfoObj[0].apkId == "0"){
                $("#thirdHasGotBtn .awardBtnName").html("知道了");
            }else{
                $("#thirdHasGotBtn .awardBtnName").html("去使用");
            }
			showThirdDialog(_awardInfoObj);
		}
	}
	if(_awardType == 7) {
		_dateObj.button_name = "现金红包";
		_dateObj2.page_state = "现金红包";
		if(_awardState == 0) {
			console.log("点击了未领取的微信红包");
            var _awardInfoStr = $(obj).attr("awardInfo");
            var _awardInfoObj = JSON.parse(_awardInfoStr);
            console.log(_awardInfoStr);
            console.log(_awardInfoObj.bonus);
            _awardName = _awardInfoObj.bonus+"元现金红包";
			_dateObj.prize_name = _awardName;
			_dateObj2.prize_name = _awardName;
			$("#awardDialogPage").css("display","block");
			$(".myawardDialogBg").css("display","none");
			$("#redNotGet").css("display","block");
			$("#redInfo1").html("奖品名称:&nbsp;&nbsp;" + _awardName);
            $("#redInfo1").attr("awardName",_awardName);
            $("#redInfo2").html("获得时间:&nbsp;&nbsp;" + _awardTime);
			map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("redQrcode2"), "btn-focus", function() {}, function(val) {}, function(obj) {});
			document.getElementById("redQrcode2").innerHTML="";
            getRedPacketsQrcode(_awardId,_activeId, _rememberId, _userkeyId, "redQrcode2", 190, 190);
		} else {
			console.log("点击了已领取的微信红包");
			_dateObj.prize_name = $("#redHasGot .onlyNum").html()+"元红包";
			_dateObj2.prize_name = $("#redHasGot .onlyNum").html()+"元红包";
			$("#awardDialogPage").css("display","block");
			$(".myawardDialogBg").css("display","none");
			$("#redHasGet").css("display","block");
			$("#redHasGetNum").html($("#redHasGot .onlyNum").html());
			map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("redHasGotBtn"), "btn-focus", function() {}, function(val) {}, function(obj) {});
		}
	}
	if(_awardType == 22) {
		console.log("点击了第三方优惠券");
		_dateObj.button_name = "第三方优惠券";
		_dateObj2.page_state = "第三方优惠券";
		$("#awardDialogPage").css("display","block");
		$(".myawardDialogBg").css("display","none");
		$("#thirdCoupon").css("display","block");
		$("#thirdCouponInfo1").html("奖品名称:&nbsp;&nbsp;" + _awardName);
        $("#thirdCouponInfo2").html("获得时间:&nbsp;&nbsp;" + _awardTime);
        $("#couponQrcode").attr("src",_awardUrl);
		map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("thirdHasGotBtn2"), "btn-focus", function() {}, function(val) {}, function(obj) {});
	}
	if(_awardType == 6) {
		var _awardInfoStr = $(obj).attr("awardInfo");
		var _awardInfoObj = JSON.parse(_awardInfoStr);
		console.log(_awardInfoObj.focaKey+"=="+_awardState);
        if(_awardInfoObj.focaKey == "reduceTime"){
            if(_awardState == 0){
                console.log("点击了未领取的减时器道具+判断当天是否使用过");
                _dateObj.button_name = "减时器道具";
                _dateObj2.page_state = "减时器道具";
                var hasUsed = $(obj).attr("todayReduce");
                $("#toolsNum").html("-"+_awardInfoObj.seconds+"'");
                console.log(hasUsed);
                if(hasUsed == 0){
                    var niandai = ["50年代","60年代","70年代","80年代","90年代","00年代","10年代"];
                    var curIndex = parseInt(todayLevel.substr(1))-1;
                    $("#toolsInfo1").html("你还没有成功完成"+niandai[curIndex]+"的答题闯关哦");
                    $("#toolsBtn1 .awardBtnName").html("去完成答题");
                    $("#toolsBtn1").attr("hasUsed","false");
                }else{
                    $("#toolsInfo1").html("别太贪心，今天已经用过减时器啦");
                    $("#toolsBtn1 .awardBtnName").html("知道啦");
                    $("#toolsBtn1").attr("hasUsed","true");
                }
                $("#awardDialogPage").css("display","block");
                $(".myawardDialogBg").css("display","none");
                $("#notGetTools1").css("display","block");
                map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("toolsBtn1"), "btn-focus", function() {}, function(val) {}, function(obj) {});
            }else {
                console.log("点击了已领取的减时器道具+不做响应");
                isNeedSend = "false";
                _dateObj.button_name = "减时器道具";
                _dateObj2.page_state = "减时器道具";
            }
        }
        if(_awardInfoObj.focaKey == "addScore"){
            console.log("点击了已领取的记分卡道具");
            _dateObj.button_name = "积分卡道具";
            _dateObj2.page_state = "积分卡道具";
            $("#awardDialogPage").css("display","block");
            $(".myawardDialogBg").css("display","none");
            $("#hasGotTools2").css("display","block");
            $("#toolsName2").html(_awardName);
            $("#toolsGotTime2").html("获得时间:&nbsp;&nbsp;" + _awardTime);
            $("#toolsWarm2").html('<span class="toolsGrade">+'+_awardInfoObj.lotteryScore+'分</span><br/>当前答题总分增加'+_awardInfoObj.lotteryScore+'分，瓜分占比提升啦！');
            map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("toolBtn2Left"), "btn-focus", function() {}, function(val) {}, function(obj) {});
        }
        if(_awardInfoObj.focaKey == "swellBonus"){
            _dateObj.button_name = "膨胀红包道具";
            _dateObj2.page_state = "膨胀红包道具";
            if(activeFlag<2){
                console.log("点击了未生效的膨胀卡==未生效");
                $("#awardDialogPage").css("display","block");
                $(".myawardDialogBg").css("display","none");
                $("#notStartTools3").css("display","block");
                $("#toolsName31").html(_awardName);
                $("#toolsGotTime31").html("获得时间:&nbsp;&nbsp;" + _awardTime);
                $("#toolsWarm31").html('<span class="toolsGrade">+'+_awardInfoObj.lotteryBonus+'元</span><br/>10月7日瓜分金额将增加'+_awardInfoObj.lotteryBonus+'元<br/>届时自动生效哦！');
                map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("toolBtn31Left"), "btn-focus", function() {}, function(val) {}, function(obj) {});
            }else{
                console.log("已开启瓜分");
                if(cutUpPool>0){
                    console.log("已开启瓜分+有资格==已生效");
                    $("#awardDialogPage").css("display","block");
                    $(".myawardDialogBg").css("display","none");
                    if (cutUpBonus == "-1"){
                        console.log("已开启瓜分+有资格+未瓜分==未领取");
                        $("#awardDialogPage").css("display","block");
                        $(".myawardDialogBg").css("display","none");
                        $("#noeGetTools3").css("display","block");
                        $("#toolsName32").html(_awardName);
                        $("#toolsGotTime32").html("获得时间:&nbsp;&nbsp;" + _awardTime);
                        $("#toolsWarm32").html('<span class="toolsGrade">+'+_awardInfoObj.lotteryBonus+'元</span><br/>瓜分金额已+'+_awardInfoObj.lotteryBonus+'元啦！');
                        map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("toolBtn32"), "btn-focus", function() {}, function(val) {}, function(obj) {});
                    }else{
                        console.log("已开启瓜分+有资格+未瓜分==已领取");
                        $("#hasGotTools3").css("display","block");
                        $("#toolsName33").html(_awardName);
                        $("#toolsGotTime33").html("获得时间:&nbsp;&nbsp;" + _awardTime);
                        $("#toolsWarm33").html('<span class="toolsGrade">+'+_awardInfoObj.lotteryBonus+'元</span><br/>瓜分金额已+'+_awardInfoObj.lotteryBonus+'元啦！');
                        map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("toolBtn33"), "btn-focus", function() {}, function(val) {}, function(obj) {});
                    }
                }else{
                    console.log("已开启瓜分+无资格==已失效");
                    console.log("不做响应");
                    isNeedSend = "false";
                }
            }
        }
	}
	if(_awardType == 17) {
		_dateObj.button_name = "津贴";
		_dateObj2.page_state = "津贴";
		console.log("津贴"+loginstatus);
		if(loginstatus == "false"){
            var _awardInfoStr = $(obj).attr("awardInfo");
            var _awardInfoObj = JSON.parse(_awardInfoStr);
            console.log(_awardInfoStr);
            console.log(_awardInfoObj.price);
            _awardName = _awardInfoObj.price+"元津贴";
			coocaaApp.startLogin();
		}else{
            console.log("跳转津贴使用版面"+tvsource);
            console.log($("#allowanceHasGot .cardName").html());
            _awardName = $("#allowanceHasGot .cardName").html()+"元津贴";
            var specialTopicId = tvsource == "tencent"?"104418":"104419";
            coocaaosapi.startMovieHomeSpecialTopic(specialTopicId, function () {}, function () {});
		}
        _dateObj.prize_name = _awardName;
        _dateObj2.prize_name = _awardName;
	}
	console.log(isNeedSend);
	if (isNeedSend == "true"){
        sentLog("web_page_show_new", _dateObj2);
    }
    sentLog("web_button_clicked_new", _dateObj);
}
function showThirdDialog(awardInfoObj){
	$("#awardDialogPage").css("display","block");
	$(".myawardDialogBg").css("display","none");
	$("#thirdCardHasGot").css("display","block");
	if (awardInfoObj[0].cardNo==undefined||awardInfoObj[0].cardNo==null||awardInfoObj[0].cardNo=="") {
		$("#cardBox").css("display","none");
		$("#cardBox2").css("display","block");
    	$("#thirdInfo42").html("兑换码:" + awardInfoObj[0].password);
	} else{
    	$("#cardBox").css("display","block");
		$("#cardBox2").css("display","none");
		$("#thirdInfo3").html("卡&nbsp;&nbsp;&nbsp;号:" + awardInfoObj[0].cardNo);
    	$("#thirdInfo4").html("兑换码:" + awardInfoObj[0].password);
	}
	map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("thirdHasGotBtn"), "btn-focus", function() {}, function(val) {}, function(obj) {});
}

function sendPrizes(oAwardId, oRememberId, oType, oUserKeyId, oActiveId, oQsource, oState) {
	console.log("----sendPrizes----");
	console.log(oAwardId+"=="+oRememberId+"=="+oType+"=="+oUserKeyId+"=="+oActiveId);
	//oState:1-首页弹窗的领取津贴，2-奖励页面的领取津贴
	if(oQsource != "tencent") {
		oQsource = "iqiyi";
	}
	var ajaxTimeoutFive = $.ajax({
		type: "GET",
		async: true,
		timeout: 5000,
		dataType: 'jsonp',
		jsonp: "callback",
		url: adressIp + "/v4/lottery/verify/receive",
		data: {
			"cUDID": oUserKeyId,
			"activeId": oActiveId,
			"awardId": oAwardId,
			"rememberId": oRememberId,
			"awardTypeId": oType,
			"userKeyId": oUserKeyId,
			"MAC": deviceInfo.mac,
			"cOpenId": openid,
			"source": oQsource
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.code == "50100") {
				console.log("领取成功" + oType);
                doAfterSendPrizes(oType,oState,data);
			} else {
				console.log("领取失败");
				dialogInfo(oType,oState);
			}
		},
		error: function() {
			dialogInfo(oType,oState);
		},
		complete: function(XMLHttpRequest, status) {
			console.log("-------------complete------------------" + status);
			if(status == 'timeout') {
				ajaxTimeoutFive.abort();
			}
		}
	});
}

function getRedPacketsQrcode(awardId, activityId, rememberId, userKeyId, id, width, height) {
	console.log("----getRedPacketsQrcode----");
	console.log(rememberId + "--" + userKeyId + "--" + id);
	var ajaxTimeoutFive = $.ajax({
		type: "GET",
		async: true,
		timeout: 7000,
		dataType: 'jsonp',
		jsonp: "callback",
		url: adressIp + "/v4/lottery/verify/wechat/qrCode",
		data: {
			"activeId": activityId,
			"awardId": awardId,
			"MAC": deviceInfo.mac,
			"cChip": deviceInfo.chip,
			"cModel": deviceInfo.model,
			"cEmmcCID": deviceInfo.emmcid,
			"cUDID": deviceInfo.activeid,
			"accessToken": access_token,
			"cOpenId": openid,
			"cNickName": deviceInfo.nick_name,
			"rememberId": rememberId,
			"userKeyId": userKeyId,
			"luckyDrawCode": "69",
			"channel": "coocaa",
			"type": 69
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.code == "200") {
				document.getElementById(id).innerHTML = "";
				var str = data.data;
				var qrcode = new QRCode(document.getElementById(id), {
					width: width,
					height: height
				});
				qrcode.makeCode(str);
			}
		},
		error: function() {
			document.getElementById(id).innerHTML = "<p class='textInfoSon'>获取失败<br/>请稍后重试</p>";
		},
		complete: function(XMLHttpRequest, status) {
			if(status == 'timeout') {
				ajaxTimeoutFive.abort();
			}
		}
	});
}
function startDraw(){
	console.log(actionId+"=="+tvsource+"=="+deviceInfo.mac+"=="+access_token+"=="+deviceInfo.activeid);
	console.log(openid);
	var ajaxTimeoutOne = $.ajax({
		type: "POST",
		async: true,
		timeout: 5000,
		dataType: 'json',
		url: adressIp + "/building/v2/web/start",
		data: {
			"id": actionId,
			"source": tvsource,
			"MAC": deviceInfo.mac,
			"cModel": deviceInfo.model,
			"cChip": deviceInfo.chip,
			"token": access_token,
			"cUDID": deviceInfo.activeid,
			"cOpenId": openid,
			"cNickName": userInfo.nick_name
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.code == 50100) {
				console.log("获取抽奖数据成功");
				showAwardDialog(data.data);
			}else{
				console.log("获取抽奖数据失败");
				$(".eachAwardStyle").css("display", "none");
                $("#dialogBox").show();
                $("#errorInfo").show();
                map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("errorInfo"), "btn-focus", function() {}, function(val) {}, function(obj) {});
			}
		},
		error: function() {
			console.log("获取数据失败+给出弹窗提示");

		},
		complete: function(XMLHttpRequest, status) {　　　　
			if(status == 'timeout') {
				ajaxTimeoutOne.abort();　　　　
			}
		}
	});
}
function showAwardDialog(obj){
	console.log(JSON.stringify(obj));

	map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("awardBtn1"), "btn-focus", function() {}, function(val) {}, function(obj) {});
}
//监听账户变化
function listenUserChange() {
    console.log("=====listenUserChange function====");
    coocaaosapi.addUserChanggedListener(function(message) {
		console.log("监听到账户发生变化");
		coocaaApp.haslogin(function(msg){
			loginstatus = msg.loginstatus;
            if(loginstatus == "true"){
            	console.log("登录成功");
                userInfo = msg.user_info;
                access_token = msg.access_token;
                vuserid = msg.vuserid;
                openid = userInfo.open_id;
                doAfterLogined();
            }else{
            	console.log("登录失败");

            }
		});
	});
}
function doAfterLogined(){
	if ($("#dialogBox").css("display") == "block"&&$("#awardBtn1").attr("awardTypeId")=="17") {
		$("#awardBtn1").trigger("itemClick");
	}
	if($("#myawardPage").css("display") == "block"){
		needSelectAllowance = (loginstatus == "true")?true:false;
		console.log(needSelectAllowance);
		selectMyAllowanceNum(1, needSelectAllowance);
		getMyaward();
		console.log(_curFocusId);
		$("#"+_curFocusId).trigger("itemClick");
	}
}
function doAfterSendPrizes(oType,oState,obj){
	if(oType == "3") {
		if (oState == "1") {
			console.log("抽中卡密奖+领取成功+展示卡号和兑换码");
			$("#dialogBox").css("display","block");
			$(".eachAwardStyle").css("display","none");
			$("#thirdCardAwardBox").css("display","block");
			$("#thirdAppMark").html(obj.data.exchangeLabel||"");
			console.log(obj.data.exchangeLabel);
			$("#thirdInfo5").html(obj.data.exchangeLabel||"");

			//判断需要展示的详情
			if (obj.data.cardInfo[0].cardNo==undefined||obj.data.cardInfo[0].cardNo==null||obj.data.cardInfo[0].cardNo=="") {
				console.log("======11111=======");
				$("#jdCardAwardInfo").html('兑换码:'+obj.data.cardInfo[0].password);
				$("#thirdAppMark").css("top","96px");
                $("#thirdCardAwardInfo").css("display","none");
                $("#jdCardAwardInfo").css("display","block");
			} else{
				console.log("======22222=======");
                $("#thirdCardAwardInfo").css("text-align","left");
                $("#thirdCardNo").html('卡&nbsp;&nbsp;&nbsp;号:'+obj.data.cardInfo[0].cardNo);
                $("#thirdCardPassword").html('兑换码:'+obj.data.cardInfo[0].password);
				$("#thirdAppMark").css("top","135px");
                $("#thirdCardAwardInfo").css("display","block");
                $("#jdCardAwardInfo").css("display","none");
			}
			map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("awardBtn1"), "btn-focus", function() {}, function(val) {}, function(obj) {});
		} else if(oState == "2"){
			console.log("奖励页面卡密奖+领取成功+展示卡号和兑换码");
			showThirdDialog(obj.data.cardInfo);
		}
	}
	if(oType == "17"){
		if(oState == 2){
			console.log("津贴领取成功+刷新奖励页面");
			getAllofMyaward();
		}else{
            selectMyAllowanceNum(2,true);
        }
	}
}
//获取跳转参数并执行
function getParamAndStart(appid) {
	console.log(appid);
	var paramObj = {
		"21132":{
			"packagename":"com.fittime.tv.common",
			"actionname":"即刻运动",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
		"21210":{
			"packagename":"cn.cibntv.ott",
			"actionname":"CIBN高清影视",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
		"26557":{
			"packagename":"org.cocos2dx.dwdoudizhu",
			"actionname":"电玩斗地主",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
		"21111":{
			"packagename":"com.cibn.tv",
			"actionname":"CIBN酷喵影视",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
		"26510":{
			"packagename":"com.m1905.tv",
			"actionname":"1905TV",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
		"21102":{
			"packagename":"com.apowo.hysg.coocaaTV",
			"actionname":"花样三国",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
		"26361":{
			"packagename":"com.stvgame.sango2",
			"actionname":"胡莱三国2",
			"bywhat":"pkg",
			"byvalue":"",
			"params":{}
		},
        "26598":{
            "packagename":"com.xy51.jjdg",
            "actionname":"军舰帝国",
            "bywhat":"pkg",
            "byvalue":"",
            "params":{}
        }
	};
    console.log(paramObj[appid]);
    var pkgname = paramObj[appid].packagename||paramObj[appid].packageName;
    var bywhat = paramObj[appid].bywhat;
    var byvalue = paramObj[appid].byvalue;
    var a = '{ "pkgList": ["' + pkgname + '"] }';
    var param1 = "",
        param2 = "",
        param3 = "",
        param4 = "",
        param5 = "";
    var str = "[]";
    coocaaosapi.getAppInfo(a, function(message) {
        console.log("getAppInfo====" + message);
        if (JSON.parse(message)[pkgname].status == -1) {
            coocaaosapi.startAppStoreDetail(pkgname, function() {
            	var _dateObj = {
					"page_name": "第三方应用下载启动",
					"page_type": "activityWindow",
					"parent_page_name": "我的奖励页面",
					"activity_name": "618活动",
					"app_name": paramObj[appid].actionname,
					"browse_result": "启动成功"
				};
				webDataLog("okr_web_clicked_result", _dateObj);
            }, function() {
            	var _dateObj = {
					"page_name": "第三方应用下载启动",
					"page_type": "activityWindow",
					"parent_page_name": "我的奖励页面",
					"activity_name": "618活动",
					"app_name": paramObj[appid].actionname,
					"browse_result": "启动失败"
				};
				webDataLog("okr_web_clicked_result", _dateObj);
            });
        } else {
            if (bywhat == "activity" || bywhat == "class") {
                param1 = pkgname;
                param2 = byvalue;
            } else if (bywhat == "uri") {
            	param1 = "action";
                param2 = "android.intent.action.VIEW";
                param5 = byvalue;
            } else if (bywhat == "pkg") {
                param1 = pkgname;
            } else if (bywhat == "action") {
                param1 = "action";
                param2 = byvalue;
                param3 = pkgname;
            }
            if (JSON.stringify(paramObj[appid].params) != "{}") {
                str = '[' + JSON.stringify(paramObj[appid].params).replace(/,/g, "},{") + ']'
            }

            coocaaosapi.startCommonNormalAction(param1, param2, param3, param4, param5, str, function() {}, function() {});
        }
    }, function(error) {
        coocaaosapi.startAppStoreDetail(pkgname, function() {}, function() {});
    });
}

function dialogInfo(type,state){
	console.log("----dialogInfo----" + type);
	if(type=="17"){
		if (state==1) {
			$(".eachAwardStyle").css("display", "none");
            $("#dialogBox").css("display", "none");
            $("#mainDivBox").css("display", "block");
            map = new coocaakeymap($(".coocaa_btn"), document.getElementById("answerBtn"), "btnFocus", function () {}, function (val) {}, function (obj) {});
		}else{
			iKnowIt();
		}
	}else if(type=="3"){
        if(state==1){
            console.log("抽中卡密但是领奖失败");
            $("#thirdCardAwardInfo").css("text-align","center");
            $("#thirdCardNo").html('服务器开小差了');
            $("#thirdCardPassword").html('请稍后到我的奖励继续领取');
            $("#thirdAppMark").css("top","135px");
            $("#awardBtn1 .awardBtnName").html("知道了");
            $("#awardBtn1").attr("apkId","-1");
            $("#thirdCardAwardInfo").css("display","block");
            $("#jdCardAwardInfo").css("display","none");
        }else{
            console.log("点击卡密奖但是领奖失败");
            $("#awardGetFail").css("display","block");
            setTimeout(function(){
                $("#awardGetFail").css("display","none");
            },3000);
        }
    }
}
function drawQrcode(id, url, wh){
	document.getElementById(id).innerHTML = "";
	var qrcode = new QRCode(document.getElementById(id), {
		width: wh,
		height: wh
	});
	qrcode.makeCode(url);
}
function toDecimal(x){
	var val = Number(x);
	if(!isNaN(parseFloat(val))) {
		val = val.toFixed(2);
	}
	val = Number(val);
	return val;
}

//获取元素的纵坐标
function getTop(e){
	var offset=e.offsetTop;
	if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
	return offset;
}
//获取元素的横坐标
function getLeft(e){
	var offset=e.offsetLeft;
	if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
	return offset;
}