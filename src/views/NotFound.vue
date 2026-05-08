<template>
  <div class="page-not-found">
    <div class="not-found-content">
      <SvgIcon name="404" dir="status" size="200" color="#999" />
      <div class="error-code">404</div>
      <p class="error-description">Desculpe, a página que você solicitou não existe.</p>

      <div class="button-group">
        <router-link to="/" class="nav-link">
          <van-button block type="primary" size="large"> Voltar à página inicial </van-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面组件
</script>

<style scoped lang="less">
.page-not-found {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.not-found-content {
  text-align: center;
  padding: 40px 20px;
}

.error-code {
  font-size: 60px;
  font-weight: bold;
  color: #007aff;
  margin: 0;
  line-height: 1;
  margin-top: 20px;
  margin-bottom: 20px;
}

.error-title {
  font-size: 28px;
  color: #333;
  margin: 0 0 12px 0;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 30px 0;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  text-decoration: none;
}

.nav-link :deep(.van-button) {
  width: 100%;
}
</style>
