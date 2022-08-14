const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave : false,
  // https://code-hoon.tistory.com/163
  // prefetch는 router로 연결된 다른 페이지들의 리소스들을 미리 다운 받는 것
  // prefetch 활성화 시키면 request 횟수가 늘어나 첫 페이지 로딩이 느릴 수 있음
  // js 리소스가 많거나, 혹은 유저가 열 가능성이 높은 페이지는 prefetch를 직접 true로 설정하는 것이 권장됨
  chainWebpack: config => {
    config.plugins.delete('prefetch');
  }
})
