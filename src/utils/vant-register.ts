import type { App } from 'vue';
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Grid,
  GridItem,
  Card,
  Icon,
  Empty,
  Loading,
  Toast,
  Notify,
  Swipe,
  SwipeItem,
  Popup,
  Dialog,
  PullRefresh,
} from 'vant';
import 'vant/lib/index.css';

/**
 * 注册常用的Vant UI组件 - 按需导入以减小包体积
 */
export function registerVantUI(app: App) {
  app.use(Button);
  app.use(NavBar);
  app.use(Tabbar);
  app.use(TabbarItem);
  app.use(Grid);
  app.use(GridItem);
  app.use(Card);
  app.use(Icon);
  app.use(Empty);
  app.use(Loading);
  app.use(Toast);
  app.use(Notify);
  app.use(Swipe);
  app.use(SwipeItem);
  app.use(Popup);
  app.use(Dialog);
  app.use(PullRefresh);
}
