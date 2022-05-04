// 获取元素切换注册于登录页面
let login = document.getElementById("login");
let register = document.getElementById("register");
let form_box = document.querySelector(".form-box");
let register_box = document.querySelector(".register-box");
let login_box = document.querySelector(".login-box");
// 获取两个按钮
var registerBtn = document.querySelector(".btn-register");
var loginBtn = document.querySelector(".btn-login");
// 用户名(长度在6~12之间，只能包含字母，数字，下划线和-)
var regName = /^[a-zA-z0-9_-]{6,12}$/;
// 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：
var regPassword = /^[a-zA-Z]\w{6,16}$/;
// eamil地址
var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// 去注册按钮点击事件
register.addEventListener("click", () => {
  form_box.style.transform = "translateX(80%)";
  login_box.classList.add("hidden");
  register_box.classList.remove("hidden");
});
// 去登录按钮点击事件
login.addEventListener("click", () => {
  form_box.style.transform = "translateX(0%)";
  register_box.classList.add("hidden");
  login_box.classList.remove("hidden");
});
// 注册正则验证且 正确就发送ajax请求
registerBtn.onclick = function () {
    // 获取表单里的值
  let re_username = document.querySelector('input[name="username"]').value;
  let re_eamil = document.querySelector('input[name="eamil"]').value;
  let re_password = document.querySelector('input[name="password"]').value;
  if (!regName.test(re_username)) {
    alert("用户名长度在6~12之间，只能包含字母，数字，下划线和-");
    return;
  } else if (!regEmail.test(re_eamil)) {
    alert("请输入正确的邮箱格式");
    return;
  } else if (!regPassword.test(re_password)) {
    alert("密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线");
    return;
  } else {
    // var formData = new FormData();
    // formData.append("username", re_username);
    // formData.append("email", re_eamil);
    // formData.append("password", re_password);
    // console.log(formData.get('username'));
    ajax({
      type: "post",
      header: {
        "Content-Type": "application/json",
      },
      url: "http://175.178.51.126:8091/smallA/register",
      data: {
        username: re_username,
        password: re_password,
        email: re_eamil
      },
    //  发送成功时的函数
      success: function(result,xhr) {
          if(result.code == 200) {
              alert('注册成功')
          } else {
              alert(result.msg)
          }
      },
      // 发送失败时返回的函数
      error: function() {
          alert('发送失败')
      }
    });
  }
};
loginBtn.onclick = function() {
    //获取表单里的值
    let login_userOrem = document.querySelector('input[name="usernameOrEmail"]').value;
    let login_password = document.querySelector('input[name="login-password"]').value;
    if(!(regName.test(login_userOrem) || regEmail.test(login_userOrem))){
        alert('请输入正确的用户名格式或邮箱格式')
        return;
    }
    else if (!regPassword.test(login_password)) {
        alert('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
        return;
    }
    let obj = {
      type: "post",
header: {
  "Content-Type": "application/json",
},
url: "http://175.178.51.126:8091/smallA/login",
data: {
    username: login_userOrem,
    password: login_password
},
// 发送成功执行的函数
success: function(result, xhr) {
  if(result.code == 200) {
      alert('登录成功');
      console.log(result);
      localStorage.setItem('username', result.data.username);
      localStorage.setItem('id', result.data.id);
      localStorage.setItem('email', result.data.email);
      localStorage.setItem('password', login_password);
      localStorage.setItem('headImg', result.data.headImg);
      window.location.href = "file:///C:/Users/pan'da'xie/Desktop/html/project/index.html"
  }
  else{
      alert(result.msg);
  }
},
error: function(result, xhr) {
    alert('发送失败')
}
  }
    if(regName.test(login_userOrem)) {
        ajax(obj)
    }
    else {
        delete obj.data.username;
        obj.data.email = login_userOrem;
        ajax(obj)
    }
}
