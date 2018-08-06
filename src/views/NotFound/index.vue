<template>
  <div class="notfound">
    <div class="pic-404">
    </div>
    <div class="bullshit">
      <div class="bullshit__oops">404!</div>
      <div class="bullshit__headline">未找到该页面</div>
      <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
      <router-link to="/" class="bullshit__return-home">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  background: #f0f2f5;
  width: 100%;
  overflow: hidden;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.pic-404 {
  width: 300px;
  padding: 30px 0;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}

.pic-404__parent {
  width: 100%;
}

.pic-404__child {
  position: absolute;
}

.pic-404__child.left {
  width: 80px;
  top: 17px;
  left: 220px;
  opacity: 0;
  animation-name: cloudLeft;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}

.pic-404__child.mid {
  width: 46px;
  top: 10px;
  left: 420px;
  opacity: 0;
  animation-name: cloudMid;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}

.pic-404__child.right {
  width: 62px;
  top: 100px;
  left: 500px;
  opacity: 0;
  animation-name: cloudRight;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}

@keyframes cloudLeft {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}

@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}

@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}

.bullshit {
  position: relative;
  width: 100%;
  padding: 10% 0;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
}

.bullshit__oops {
  font-size: 70px;
  font-weight: bold;
  line-height: 40px;
  color: #1482f0;
  opacity: 0;
  margin-bottom: 20px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.bullshit__headline {
  font-size: 16px;
  line-height: 24px;
  color: #1482f0;
  opacity: 0;
  margin-bottom: 10px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.1s;
  animation-fill-mode: forwards;
}

.bullshit__info {
  font-size: 13px;
  line-height: 21px;
  color: grey;
  opacity: 0;
  margin-bottom: 30px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.2s;
  animation-fill-mode: forwards;
}

.bullshit__return-home {
  margin: 0 auto;
  display: block;
  /*float: left;*/
  width: 110px;
  height: 36px;
  background: #1482f0;
  border-radius: 100px;
  text-align: center;
  color: #ffffff;
  opacity: 0;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
}

@keyframes slideUp {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
