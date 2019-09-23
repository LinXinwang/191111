/**
 * Created by Mr.jr on 2019/8/13.
 */
var accountVersion = ""; // 账户版本
var browserVersion = 0;//浏览器版本
var cAppVersion = 0;//影视版本
var activityCenterVersion = 0;//活动中心版本
var mallVersion = 0;//商城版本
var actionId = "";//活动id
var actionId2 = "";//预热活动id
var tvsource = "";//电视源
var deviceInfo = "";//设备信息
var userInfo = "";//用户信息；在调用haslogin之后可获取到；但经过多重判断，openid可直接从返回处取值，避免掉线情况下仍有openid 的情况
var loginstatus = "false"; //登录状态-string
var access_token = ""; //accesstoken
var vuserid = ""; //微信第三方id
var openid = "";

//正式环境相关地址===================
// var adressIp = "https://restful.skysrt.com";                                                                            //活动后台接口地址
// var orderUrl = "https://api-business.skysrt.com/v3/order/genOrderByJsonp.html?data=";                                   //下单接口--暂时无用
// var operationurl="http://api.home.skysrt.com/v1/tvos/getWebPageContent";                                                //获取主页配置信息接口
// var enurl = "https://webapp.skysrt.com/activity101/mobile/index.html?";                                                //实体奖url
// var allowanceUrl = "https://jintie.coocaa.com/api/subsidy/v1/query-userSubsidyInfo-byToken";                            //津贴查询接口
// var allowanceClientId = "YS_RELEASE";//津贴clientid
// var vipstartUrl = "https://api-business.skysrt.com/v3/web/actCenter/index.html";                                        //产品包直接出二维码页面
// var isDebug = false;

//测试环境相关地址===================
var adressIp = "http://beta.restful.lottery.coocaatv.com";
var orderUrl = "http://172.20.132.182:8090/v3/order/genOrderByJsonp.html?data=";
var operationurl="http://beta-api-home.skysrt.com/tvos/getWebPageContent";
var enurl = "http://beta.webapp.skysrt.com/games/webapp/101/mobile/index.html?";//实体奖url
var allowanceUrl = "http://172.20.155.209:6081/api/subsidy/v1/query-userSubsidyInfo-byToken"  //查询津贴地址
var allowanceClientId = "YS_BETA";
var vipstartUrl = "http://dev.business.video.tc.skysrt.com/v3/web/actCenter/index.html";
var _urlMockSrv = 'http://172.20.155.103:3000/mock/305';
var isDebug = true;

//以上为共用参数；以下开始为业务全局变量
var userKeyId = "";
var marqueeInterval = null;//中奖喜讯轮播用
var browserVersionLow = false;
var activeFlag = "";//记录活动状态：0-进行中；1-已结束或已冻结；2-开始瓜分
var starTime="";
var nowTime="";

//lxw
var _curFocusId = null;
var awardObjBox = {}; //存储奖励对象
var dialogTime = ""; //报错toast
var hasGotAllowance = "2"; //是否获取津贴
var hasGotActionaward = "2"; //是否获取我的奖励
var hasGotPreheataward = "2"; //是否获取我的预热奖励
var needSelectAllowance = false; //是否需要查询津贴
var myAllowanceNum = 0;//记录我的津贴奖励
var arr17 =[];//津贴奖
var arr7 =[];//红包将
var arr2 =[];//实物奖
var arr3 =[];//卡密奖
var arr22 =[];//第三方优惠券
var arr23 =[];//黄金红包奖
var parameter = {
	"btnStyle": 2, //奖励按钮样式，1：文字,取值btnNameArry2，btnNameArry3；2：图片，取值 btnImgArray2，btnImgArray3
	"btnIdArry1": ["17","7","2","3","22","23"],//当前奖品类型，与btnNameArry2，btnImgArray2一一对应
	"buttonInitNum": 3, //一行最多有几个奖励
	"awardBoxWidth": "348px", //每个奖励单元的宽度
	"awardBoxHeight": "184px", //每个奖励单元的高度
	"pageInitStyle": 1 //选择第几个样式
}
