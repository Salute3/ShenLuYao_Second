/**
 * get和post的封装函数
 * 
 * @param {*} url 
 * @param {*} type 
 * @param {*} data (key1=value1&key2=value2)
 * @param {*} success 
 */
function ajax(option) {
    var xhr = new XMLHttpRequest();
    if (option.type == 'get' && option.data) {
        option.url += '?' + option.data;
        option.data = null;
    }
    xhr.open(option.type, option.url);
    if (option.type == 'post' && option.data) {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (option.success) {
                    option.success(xhr.responseText);
                }
            } else {
                if (option.error) {
                    option.error(xhr.status);
                }
            }
        }
    }
    console.log(option);
    xhr.send(option.data);
}
// 封装xhr
// 封装post请求
function post(url, data, success) {
    let xhr = new XMLHttpRequest
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState == 4 && xhr.status == 200)
            // console.log(xhr.responseText);

            success(xhr.responseText)

    })
    xhr.open('post', url)
    if (data) {
        // console.log(1);
        xhr.setRequestHeader('Content-type', 'aplication/x-www-form-urlencoded')
    }
    if (localStorage.getItem('token')) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('token'))
    }
    xhr.send(data)
}

//封装get请求
function get(url, data, success) {

    let xhr = new XMLHttpRequest()
    if (data) {
        url += '?'
        url += data
    }
    xhr.open('get', url)
    if (localStorage.getItem('token')) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('token'))
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success(xhr.responseText)
        }
    }
    xhr.send()
}
// 懒加载
const boxs = document.querySelectorAll('.box')
const callback = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const box = entry.target;
            const data_src = box.getAttribute('data-src');
            box.setAttribute('src', data_src);
            observer.unobserve(box);
            console.log('触发');

        };
    });
};
// IntersectionObserver观察
const observer = new IntersectionObserver(callback);
boxs.forEach(box => {
    observer.observe(box);
});
var date;
var upload = document.getElementsByClassName('upload')[0];
var uncheck = document.getElementById('uncheck')
var check = document.getElementById('check')
var user = document.getElementById('user')
var code = document.getElementById('code')
var logOnFalse = document.getElementById('logOnFalse')
var LogOn = document.getElementsByClassName('LogOn')[0]
var homepage = document.getElementsByClassName('homepage')[0]
upload.addEventListener('click', function () {
    if (!check.checked) {
        if (uncheck != null) {
            uncheck.style.display = 'block';
        }
    }
    else {
        uncheck.style.display = 'none';
        post('http://175.178.4.54:3007/user/login', `username=${user.value}&password=${code.value}`, function (data) {
            let re = JSON.parse(data)
            if (re.status == 200) {
                logOnFalse.style.display = 'none';
                LogOn.style.display = 'none';
                homepage.style.display = 'block';
                alert(`账号密码正确，${user.value}成功登录`)
            } else {
                if (logOnFalse != null) {
                    logOnFalse.style.display = 'block';
                }
            }

        })

    }
})
// 主页
// 获取文章数量
// < li id = "recommed" > 推荐</ >
// <li id="video">视频</li>
// <li id="literature">文学</li>
// <li id="art">绘画</li>
// <li id="photo">摄影</li>
// <li id="film">影视</li>
// <li id="entertament">娱乐</li>
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var dataLab = document.getElementsByClassName('dataLab')[0];
var DataType = document.getElementsByClassName('DataType')[0];
var dataType = DataType.querySelectorAll('li')
var pages = 1;
// 初始化为主页推荐页面
function home() {
    get(`http://175.178.4.54:3007/article/getArticle`, `type=推荐&page=${pages}&size=30`, function (data) {
        let re = JSON.parse(data);
        if (re.status == 200) {
            console.log('请求成功');
            createBox(re);
            function createBox(re) {
                for (var i = 0; i < re.data.articleList.length; i++) {
                    // 建立每一个盒子
                    let box = document.createElement('div');
                    box.className = 'box';
                    // 建立盒子的标题
                    let Title = document.createElement('p');
                    Title.className = 'Title';
                    Title.innerText = re.data.articleList[i].title;
                    // 将标题添加到盒子元素中
                    box.appendChild(Title);
                    // 将盒子添加到容器元素中
                    dataLab.appendChild(box);
                    get(`http://175.178.4.54:3007/article/getDetails`, `articleId=${re.data.articleList[i].articleId}`, function (data) {
                        let re2 = JSON.parse(data);
                        if (re2.status == 200) {
                            createBox(re2);
                            function createBox(re2) {
                                // 建立图片盒子
                                let imgs = document.createElement('img');
                                imgs.className = 'dataImg';
                                // console.log(`${re2.data.img}`);
                                imgs.src = re2.data.img[0];
                                // 将图片添加到盒子元素中
                                box.insertBefore(imgs, box.children[0]);
                                // 爱心
                                let heart = document.createElement('img')
                                heart.className = 'heart';
                                heart.src = 'image/爱心2.png';
                                // 将爱心添加到盒子元素中
                                box.appendChild(heart);
                                // 建立标签盒子
                                let label = document.createElement('div');
                                label.className = 'label';
                                // console.log(`${re2.data.label[0]}`);
                                label.innerHTML = '#' + re2.data.label[0];
                                // 将图片添加到盒子元素中
                                box.appendChild(label);
                                // 建立作者姓名盒子
                                let authorNames = document.createElement('div');
                                authorNames.className = 'authorNames';
                                authorNames.innerHTML = re2.data.authorName;
                                // 将作者添加到盒子元素中
                                box.appendChild(authorNames);
                                var liked = 0;
                                // 喜欢盒子
                                heart.addEventListener('click', function () {
                                    heart.src = 'image/header.png';
                                    // if (liked == 0) {
                                    //     // 喜欢事件
                                    //     post('http://175.178.4.54:3007/like/likeArticle', `article_id=${this.articleId}`, function (data) {
                                    //         let re3 = JSON.parse(data)
                                    //         if (re3.status == 200) {
                                    //             heart.src = 'image/header.png';
                                    //             console.log('喜欢成功');
                                    //             liked = 1;
                                    //         }
                                    //         else {
                                    //             console.log('喜欢失败');
                                    //             console.log(re3.message)
                                    //         }
                                    //     })
                                    // }
                                    // else if (liked == 1) {
                                    //     // 取消喜欢事件
                                    //         post('http://175.178.4.54:3007/like/cancelLikeArticle', `article_id=${this.articleId}`, function (data) {
                                    //             let re3 = JSON.parse(data)
                                    //             if (re3.status == 200) {
                                    //                 heart.src = 'image/爱心2.png';
                                    //                 console.log('取消喜欢成功');
                                    //                 liked=0;
                                    //             }
                                    //             else {
                                    //                 console.log('取消喜欢失败');
                                    //             }
                                    //         })
                                    // }
                                })
                            }
                        }
                    })
                }
            }
        }
        else {
            console.log('请求错误', re.message);
        }
        // 加载下一页
        // 滚动监听
        window.addEventListener('scroll', () => {
            if (dataLab.lastElementChild.getBoundingClientRect().top < window.innerHeight) {
                pages++;
                home();
            }
        })
    })
}
home();

// 点击切换tag
for (var i = 0; i < dataType.length; i++) {
    dataType[i].onclick = function () {
        // 先把所有的下划线去掉  干掉所有人
        for (var i = 0; i < dataType.length; i++) {
            dataType[i].style.borderBottom = 'none'
        }
        // 只添加自己的
        this.style.borderBottom = ' 3px solid black';
        console.log(`${this.innerHTML}`);
        get(`http://175.178.4.54:3007/article/getArticle`, `type=${this.innerHTML}&page=${pages}&size=10`, function (data) {
            let re = JSON.parse(data);
            if (re.status == 200) {
                console.log('请求成功');
                function createBox(re) {
                    for (var i = 0; i < re.data.articleList.length; i++) {
                        // 建立每一个盒子
                        let box = document.createElement('div');
                        box.className = 'box';
                        // 建立盒子的标题
                        let Title = document.createElement('p');
                        Title.className = 'Title';
                        Title.innerText = re.data.articleList[i].title;
                        // 将标题添加到盒子元素中
                        box.appendChild(Title);
                        // 将盒子添加到容器元素中
                        dataLab.appendChild(box);
                        get(`http://175.178.4.54:3007/article/getDetails`, `articleId=${re.data.articleList[i].articleId}`, function (data) {
                            let re2 = JSON.parse(data);
                            if (re2.status == 200) {
                                createBox(re2);
                                function createBox(re2) {
                                    // 建立图片盒子
                                    let imgs = document.createElement('img');
                                    imgs.className = 'dataImg';
                                    // console.log(`${re2.data.img}`);
                                    imgs.src = re2.data.img[0];
                                    // 将图片添加到盒子元素中
                                    box.insertBefore(imgs, box.children[0]);
                                    // 爱心
                                    let heart = document.createElement('img')
                                    heart.className = 'heart';
                                    heart.src = 'image/爱心2.png';
                                    // 将爱心添加到盒子元素中
                                    box.appendChild(heart);
                                    // 建立标签盒子
                                    let label = document.createElement('div');
                                    label.className = 'label';
                                    // console.log(`${re2.data.label[0]}`);
                                    label.innerHTML = '#' + re2.data.label[0];
                                    // 将标签添加到盒子元素中
                                    box.appendChild(label);
                                    // 建立作者姓名盒子
                                    let authorNames = document.createElement('div');
                                    authorNames.className = 'authorNames';
                                    authorNames.innerHTML = re2.data.authorName;
                                    // 将作者添加到盒子元素中
                                    box.appendChild(authorNames);

                                    // 喜欢盒子
                                    heart.addEventListener('click', function () {
                                        if (liked == 0) {
                                            // 喜欢事件
                                            post('http://175.178.4.54:3007/like/likeArticle', `article_id=${this.articleId}`, function (data) {
                                                let re = JSON.parse(data)
                                                if (re.status == 200) {
                                                    heart.src = 'image/header.png';
                                                    console.log('喜欢成功');
                                                    liked = 1;
                                                }
                                                else {
                                                    console.log('喜欢失败');
                                                }
                                            })
                                        }
                                        else if (liked == 1) {
                                            // 取消喜欢事件
                                                post('http://175.178.4.54:3007/like/cancelLikeArticle', `article_id=${this.articleId}`, function (data) {
                                                    if (re.status == 200) {
                                                        heart.src = 'image/爱心2.png';
                                                        console.log('取消喜欢成功');
                                                        liked = 0;
                                                    }
                                                    else {
                                                        console.log('取消喜欢失败');
                                                    }
                                                })
                                        }
                                    })
                                }
                            }
                        })

                    }
                }
                createBox(re);
            }
            else {
                console.log('请求错误', re.message);
            }
            window.addEventListener('scroll', () => {
                if (dataLab.lastElementChild.getBoundingClientRect().top < window.innerHeight) {
                    pages++;
                }
            })
        })
    }
}
// 搜素页面
var searchlab = document.getElementsByClassName('searchlab')[0]
var searchInterface = document.getElementsByClassName('searchInterface')[0]
searchlab.addEventListener('click',function(){
    homepage.style.display='none';
    searchInterface.style.display = 'block';
})





