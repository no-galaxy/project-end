// 获取元素
var form = document.querySelector('form')
var inputs = document.getElementsByTagName('input');
var labels = document.getElementsByTagName('label');
var btn = document.getElementById('btn');
var span = document.querySelector('span');
var getCode = document.getElementById('get-code');
// 密码(以字母开头，长度在6~16之间，只能包含字母、数字和下划线)：
var regPassword = /^[a-zA-Z]\w{6,16}$/;
// 邮箱
var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
inputs[0].onblur = function() {
    if (this.value != '') {
        if (!regEmail.test(this.value)) {
            labels[0].className = 'wrong';
            labels[0].innerHTML = '请输入正确邮箱格式';
        } else {
            labels[0].className = 'right';
            labels[0].innerHTML = '邮箱格式输入正确';
        }
    } else {
            labels[0].className = '';
            labels[0].innerHTML = 'Email';
            
    }
};
inputs[1].onblur = function() {
    if (this.value != '') {
        if (!regPassword.test(this.value)) {
            labels[1].className = 'wrong';
            labels[1].innerHTML = '密码以字母开头，长度在6~16之间，只能包含字母、数字和_';
        } else {
            labels[1].className = 'right';
            labels[1].innerHTML = '密码格式输入正确';
        }
    } else {
        labels[1].className = '';
        labels[1].innerHTML = 'NewPassword';
    }
};
getCode.onclick = function() {
    if(regEmail.test(inputs[0].value)) {
    ajax ( {
        type: 'post',
        header: {
            'Content-Type':'application/json'
        },
        url: 'http://175.178.51.126:8091/smallA/getCode',
        data: {
            email: inputs[0].value
        },
        success: function(result, xhr) {
            console.log(result);
            if (result.code == 200) {
            span.innerHTML = '已发送，请输入验证码，验证码五分钟内有效';
        } else {
            span.innerHTML = result.msg
        }
        }
    })
}
}
btn.onclick = function() {
    let formData = new FormData(form);
    ajax ( {
        type: 'post',
        header: {
            'Content-Type':'application/json'
        },
        url: 'http://175.178.51.126:8091/smallA/rememberPwd',
        data: {
            email: formData.get('email'),
            newPassword: formData.get('newPassword'),
            code: formData.get('code')
        },
        success: function(result, xhr) {
            console.log(result);
            if (result.code == 200) {
            span.innerHTML = '修改成功，可返回登录页面重新登录';
        } else {
            span.innerHTML = result.msg
        }
        }
    })
}