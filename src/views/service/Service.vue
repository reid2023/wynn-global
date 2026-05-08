<template>
  <div class="page-service pb-3xl">
    <van-nav-bar title="客服中心" left-arrow @click-left="goBack" />
    <div class="p-lg">
      <div class="text-center mb-xl">
        <h1 class="section-title">{{ $t('service') }}</h1>
        <p class="text-secondary">7x24小时在线服务</p>
      </div>

      <!-- 联系方式 -->
      <div class="contact-list">
        <div class="contact-item">
          <div class="contact-icon">📞</div>
          <div class="contact-info">
            <p class="contact-title">电话客服</p>
            <p class="contact-number">400-123-4567</p>
          </div>
          <van-button type="primary" size="small">拨打</van-button>
        </div>

        <div class="contact-item">
          <div class="contact-icon">💬</div>
          <div class="contact-info">
            <p class="contact-title">在线客服</p>
            <p class="contact-number">工作时间：09:00-21:00</p>
          </div>
          <van-button type="primary" size="small">联系</van-button>
        </div>

        <div class="contact-item">
          <div class="contact-icon">✉️</div>
          <div class="contact-info">
            <p class="contact-title">电子邮件</p>
            <p class="contact-number">service@example.com</p>
          </div>
          <van-button type="primary" size="small">发送</van-button>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="mt-xl">
        <h3 class="section-title">常见问题</h3>
        <van-collapse>
          <van-collapse-item title="如何重置密码？" name="1">
            点击登录页面的"忘记密码"，按照提示重置密码。
          </van-collapse-item>
          <van-collapse-item title="如何联系客服？" name="2">
            可通过电话、在线客服或邮件联系我们。
          </van-collapse-item>
          <van-collapse-item title="如何提交反馈？" name="3">
            在"关于我们"菜单中有反馈入口。
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="less">
.contact-list {
  display: grid;
  gap: var(--spacing-md);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.contact-icon {
  font-size: 32px;
  min-width: 50px;
  text-align: center;
}

.contact-info {
  flex: 1;
}

.contact-title {
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs) 0;
}

.contact-number {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: bold;
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
}
</style>
