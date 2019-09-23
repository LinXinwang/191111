var domain = 'http://beta.restful.lottery.coocaatv.com';
//var domain = 'https://restful.skysrt.com';
var dataName = '';
var dataPhone = '';
var dataAddress = '';
var add1 = '';
var add2 = '';
// var userAddress = {};
// var awardImg = '';
var awardName = '';
var rememberId = '';
var activeId = '';
var userKeyId = '';

$(function () {
    //获取url中的参数
    function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return decodeURI(r[2], 'utf-8');
      return null; //返回参数值
    }
    activeId = getUrlParam('activeId');
    rememberId = getUrlParam('rememberId');
    userKeyId = getUrlParam('userKeyId');
    cooc = [];
    //awardImg = getUrlParam('awardImg');
    //awardName = getUrlParam('awardName');
    // console.log("awardName"+awardName);
    console.log(domain+'/v4/lottery/verify/getAwardStatus?rememberId='+rememberId+'&activeId='+activeId+'&userKeyId='+userKeyId+'&source=1');
    $.ajax({
        url: domain+'/v4/lottery/verify/getAwardStatus',
        asyns: false,
        type: 'get',
        data: {
            "rememberId": rememberId,
            "activeId": activeId,
            "userKeyId": userKeyId,
            "source": 1
        },
        jsonp: "callback",
        dataType:'jsonp',
        success: function(data){
            console.log(data);
            var code = data.code;
            if(code == "50100"){
                awardName = data.data.awardName;
                $('#awardName').text(awardName);
                if(data.data.awardTypeId == 15){
                    _czc.push(['_trackEvent', '领奖现金奖页面曝光', userKeyId, '未领取', '']);
                    $('#phone_page').css('display', 'block');
                    $('#money').html(data.data.bonus);                    
                }else if(data.data.awardTypeId == 2){
                    _czc.push(['_trackEvent', '领奖实物奖页面曝光', userKeyId, '未领取', '']);
                    $('#address_page,.shiwu').css('display', 'block');
                    $('#awardImg').attr('src', data.data.awardUrl);
                }else if(data.data.awardTypeId == 16){
                    _czc.push(['_trackEvent', '领奖锦鲤奖页面曝光', userKeyId, '未领取', '']);
                    $('#address_page,.jinli').css('display', 'block');
                    $('#jinli').html(data.data.queue);
                }
            }else if(code == "50021"){
                     _czc.push(['_trackEvent', '领奖页面曝光（手机）', userKeyId, '已领取', '']);
                    $('#entered_page').css('display', 'block');
                    // if(data.data.awardTypeId == 16){
                    //     $('#type15').css('display', 'block');
                    //     $('#type2').css('display', 'none');
                    // //    $('.money1').html(data.data.bonus);
                    // }else if(data.data.awardTypeId == 2){
                    //     $('#type2').css('display', 'block');
                    //     $('#type15').css('display', 'none');
                    // }
                    $('#phone_page').css('display', 'none');
                    $('#address_page').css('display', 'none');
                    awardName = data.data.awardName;
                    $('#awardName1').text(awardName);
                    $('#awardPic1').attr('src', data.data.awardUrl);
            }else if(code == "50005"){
                $('#wzj_page').css('display', 'block');
            } 
        },
        error: function(err){
            console.log(err);
        }
    });
    
    //picker
    $(document).on("pageInit", "#page-city-picker", function(e) {
        $("#city-picker").cityPicker({
            // value: []
            //value: ['四川', '内江', '东兴区']
        });
        $('.select-area').on('click', function() {
            $("#city-picker").picker('open')
        });
    });
    $.init();
//实物地址
//
    viewLogData = {
            vip_name:"测试",
            scanTool:'扫码工具',
            focused_vip_duration:"======",
            open_id:'暂无'
    };
//    cooc.push(['_trackEvent','mobile_choose_product_page_show','曝光',viewLogData]);
    $('#addSubmit').on('click', function(e) {
        
        e.preventDefault();
        var nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]+)$/;
        if ($('#name').val() == '') {
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } else if(!nameReg.test($.trim($('#name').val()))) {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }
        //验证手机
        var reg = new RegExp('^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\\d{8}$');
        if (reg.test($.trim($('#phone').val()))) {
            console.log("手机号码正确");
        } else if($('#phone').val()==''){
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入手机号码');
            setTimeout(function(){
              $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }else{
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的手机号码')
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        };

        if ($('#city-picker').val() =='') {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请选择所在地区');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }
        var addrReg = /^[\u4e00-\u9fa5-#a-zA-Z0-9\s]+$/;
        if ($('#address').val() =='') {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入详细地址');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } else if (!addrReg.test($.trim($('#address').val()))){
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确详细住址');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } 
        dataName = $('#name').val().replace(/\s+/g,"");
        dataPhone = $('#phone').val().replace(/\s+/g,"");
        add0 = $('#city-picker').val().replace(/\s+/g,"");
        add1 = $('#city-picker').val();
        add2 = $('#address').val().replace(/\s+/g,"");
        add3 = add1.split(" ");
        console.log(add3);
        if(add3[2] != ""){//有省份
            add_shen = add3[0]+"省";
            add_shi = add3[1]+"市";
            add_qu = add3[2];
        }else{
            add_shen = add3[0]+"市";
            add_shi = add3[0]+"市";
            add_qu = add3[1];
        }


        dataAddress = add0 + add2;
        $('#address_page').css('display', 'none');
        $('#affirm_value').css('display', 'block');
        $("#affirmBack").css('display', 'block');
        $('.this_name').text(dataName);
        $('.this_tel').text(dataPhone);
        $('.this_addr').text(dataAddress);
    })
    $("#phoneSubmit").on('click', function(e){
        e.preventDefault();
        var nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]+)$/;
        if ($('#name1').val() == '') {
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } else if(!nameReg.test($.trim($('#name1').val()))) {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }

        //验证手机
        var reg = new RegExp('^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\\d{8}$');
        if (reg.test($.trim($('#phone1').val()))) {
            console.log("手机号码正确");
        } else if($('#phone1').val()==''){
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入手机号码');
            setTimeout(function(){
              $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }else{
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的手机号码')
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        };
        dataPhone = $('#phone1').val().replace(/\s+/g,"");
        $('#phone_page').css('display', 'none');
        $('#affirm_phone').css('display', 'block');
        $('.this_tel').text(dataPhone);



    });
    $('#affirmBack').on('click',function() {
        $('#address_page').css('display','block');
        $('#affirm_value').css('display', 'none');
    })
    $('#phoneBack').on('click',function() {
        $('#phone_page').css('display','block');
        $('#affirm_phone').css('display', 'none');
    })
    /*$('#useNew').on('click',function() {
        $('#address_page').css('display','block');
        $('#awardName').text(awardName);
        $('#awardImg').attr('src', awardImg);
        $('#affirm_value').css('display', 'none');
    })
*/
function closewin(){
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
        window.location.href="about:blank";
        window.close();
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}
    $('#sub_again').on('click',function(e){
        window.location.reload();
    })
    $('#sub_ok').on('click',function(e){
        closewin();
        console.log("关闭页面");
    })
    $('#affirmInfo').on('click',function(e){
        var nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]+)$/;
        if ($('#name').val() == '') {
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } else if(!nameReg.test($.trim($('#name').val()))) {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }
        //验证手机
        var reg = new RegExp('^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\\d{8}$');
        if (reg.test($.trim($('#phone').val()))) {
            console.log("手机号码正确");
        } else if($('#phone').val()==''){
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入手机号码');
            setTimeout(function(){
              $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }else{
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的手机号码')
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        };

        if ($('#city-picker').val() =='') {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请选择所在地区');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }
        var addrReg = /^[\u4e00-\u9fa5-#a-zA-Z0-9\s]+$/;
        if ($('#address').val() =='') {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入详细地址');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } else if (!addrReg.test($.trim($('#address').val()))){
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确详细住址');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } 
        dataName = $('#name').val().replace(/\s+/g,"");
        dataPhone = $('#phone').val().replace(/\s+/g,"");
        add0 = $('#city-picker').val().replace(/\s+/g,"");
        add1 = $('#city-picker').val();
        add2 = $('#address').val().replace(/\s+/g,"");
        add3 = add1.split(" ");
        console.log(add3);
        if(add3[2] != ""){//有省份
            add_shen = add3[0]+"省";
            add_shi = add3[1]+"市";
            add_qu = add3[2];
        }else{
            add_shen = add3[0]+"市";
            add_shi = add3[0]+"市";
            add_qu = add3[1];
        }



        console.log('-------------省：'+add_shen+";市"+add_shi+";区"+add_qu+";详细地址"+add2);
        console.log(domain+'/v4/lottery/verify/receiveFromPhone?activeId='+activeId+'&rememberId='+rememberId+'&userKeyId='+userKeyId+'&address='+add2+'&mobile='+dataPhone+'&receiveName='+dataName+'&province='+add_shen+'&city='+add_shi+'&district='+add_qu);
        console.log('affirmInfo');
        e.preventDefault();
         _czc.push(['_trackEvent', '“提交”按钮', userKeyId, awardName, '']);
        $.ajax({
            type:'get',
            url: domain+'/v4/lottery/verify/receiveFromPhone',
            jsonp: "callback",
            dataType:'jsonp',
            data: {
                "activeId": activeId,
                "rememberId": rememberId,
                "userKeyId": userKeyId,
                "address": add2,
                "mobile": dataPhone,
                "receiveName": dataName,
                "province":add_shen,//省
                "city":add_shi,//市
                "district":add_qu
            },
            beforeSend: function(){
                $('#affirmInfo').attr('disabled', 'disabled');
                $('#affirmInfo').css('backgroundColor', '#ddd');
            },
            success:function(data){
                console.log(data);
                var code = data.code;
                if(code == 50100){
                    $('#tips_value').css('display','block');
                    $('#address_page').css('display', 'none');
                    $('#phone_page').css('display', 'none');
                    /*userAddress = {
                        'dataName': dataName,
                        "dataAddress": dataAddress,
                        "dataPhone": dataPhone,
                    };
                    console.log('userAddress', userAddress);
                    localStorage.removeItem("userAddress");
                    localStorage.setItem("userAddress", JSON.stringify(userAddress));*/
                    var viewLogData = {
                            "page_name":"领取奖品",
                            "activity_name":"418活动",
                            "receive_result":"领取成功",
                            "award_type":"实物奖品",
                            "award_name":awardName
                    };
                    cooc.push(['_trackEvent','okr_web_clicked_result','结果',viewLogData]);
                    _czc.push(['_trackEvent', '领取奖品结果', awardName+"提交成功", userKeyId, '']);
                }else if(status == 50005){
                //    $('#affirm_value').css('display', 'none');
                    $('#address_page').css('display', 'none');
                    $('#phone_page').css('display', 'none');
                    $('#wzj_page').css('display', 'block');
                }
            },
            error:function(error){
            //    $('#affirm_value').css('display', 'none');
                $('#address_page').css('display', 'none');
                $('#phone_page').css('display', 'none');
                $('#enterFail_page').css('display','block');
                console.log(error);
                    var viewLogData = {
                            "page_name":"领取奖品",
                            "activity_name":"418活动",
                            "receive_result":"领取失败",
                            "award_type":"实物奖品",
                            "award_name":awardName
                    };
                    cooc.push(['_trackEvent','okr_web_clicked_result','结果',viewLogData]);
                console.log('提交保存地址失败！');
                 _czc.push(['_trackEvent', '领取奖品结果', awardName+"提交失败", userKeyId, '']);
            }
        });
    });
    $('#phoneInfo').on('click',function(e){
        e.preventDefault();
        var nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]+)$/;
        if ($('#name1').val() == '') {
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        } else if(!nameReg.test($.trim($('#name1').val()))) {
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的姓名');
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }
        //验证手机
        var reg = new RegExp('^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\\d{8}$');
        if (reg.test($.trim($('#phone1').val()))) {
            console.log("手机号码正确");
        } else if($('#phone1').val()==''){
            $('.tips-message').css('display','block')
            $('.tips-message').text('请输入手机号码');
            setTimeout(function(){
              $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        }else{
            $('.tips-message').css('display','block');
            $('.tips-message').text('请输入正确的手机号码')
            setTimeout(function(){
                $('.tips-message').css({'display':'none'});
            },1000);
            return false;
        };
        dataName = $('#name1').val().replace(/\s+/g,"");
        dataPhone = $('#phone1').val().replace(/\s+/g,"");
        _czc.push(['_trackEvent', '“提交”按钮', userKeyId, awardName, '']);
        $.ajax({
            type:'get',
            url: domain+'/v4/lottery/verify/receiveFromPhone',
            jsonp: "callback",
            dataType:'jsonp',
            data: {
                "activeId": activeId,
                "rememberId": rememberId,
                "userKeyId": userKeyId,
                "mobile": dataPhone,
                "receiveName": dataName,
            },
            beforeSend: function(){
                $('#phoneInfo').attr('disabled', 'disabled');
                $('#phoneInfo').css('backgroundColor', '#ddd');
            },
            success:function(data){
                console.log(data);
                var code = data.code;
                if(code == 50100){
                    $('#tips_phone').css('display','block');
                    $('#phone_page').css('display', 'none');
                    $('#address_page').css('display', 'none');
                    /*userAddress = {
                        'dataName': dataName,
                        "dataAddress": dataAddress,
                        "dataPhone": dataPhone,
                    };
                    console.log('userAddress', userAddress);
                    localStorage.removeItem("userAddress");
                    localStorage.setItem("userAddress", JSON.stringify(userAddress));*/
                    _czc.push(['_trackEvent', '领取奖品结果', awardName+"提交成功", userKeyId, '']);
                }else if(status == 50005){
                    $('#phone_page').css('display', 'none');
                    $('#address_page').css('display', 'none');
                    $('#wzj_page').css('display', 'block');
                }
            },
            error:function(error){
                $('#affirm_phone').css('display', 'none');
                $('#enterFail_page').css('display','block');
                console.log(error);
                console.log('提交保存地址失败！');
                _czc.push(['_trackEvent', '领取奖品结果', awardName+"提交失败", userKeyId, '']);
            }
        });
    });
});
