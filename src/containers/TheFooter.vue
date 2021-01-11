<template>
  <CFooter :fixed="false">
    <div>
      <a style="color: #1fbc27" href="https://peaga.xyz" target="_blank">Peaga Inc.</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}}Hutech Management.</span>
    </div>
    <!-- <div class="mfs-auto">
      <span class="mr-1" target="_blank">Powered by</span>
      <a href="https://coreui.io/vue">CoreUI for Vue</a>
    </div> -->
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
