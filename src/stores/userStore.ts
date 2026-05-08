import { userApi } from '@/services';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { local } from '@/utils/storage';
import { LOCAL_KEY } from '@/config';
import { UserProfile } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  /**
   * 判断用户是否登录
   */
  const isLoggedIn = ref<boolean>(local.get(LOCAL_KEY.USER_TOKEN) ? true : false);

  /**
   * 用户信息
   */
  const userProfile = ref<UserProfile | null>(null);

  const setIsLoggedIn = (token: string) => {
    local.set(LOCAL_KEY.USER_TOKEN, token);
    isLoggedIn.value = true;
  };

  const getUserProfile = async () => {
    if (!isLoggedIn.value) return null;
    try {
      const response = await userApi.getUserProfile();
      if (response.data) {
        userProfile.value = response.data as UserProfile;
        return userProfile.value;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
    return null;
  };

  const logout = async () => {
    try {
      await userApi.logout();
      local.remove(LOCAL_KEY.USER_TOKEN);
      isLoggedIn.value = false;
      userProfile.value = null;
      location.reload();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    userProfile,
    getUserProfile,
    logout,
  };
});
