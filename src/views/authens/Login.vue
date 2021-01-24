<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardHeader>LOGIN TO HUTECH MANAGEMENT</CCardHeader>
              <CCardBody>
                <CForm>
                  <v-form
                    v-on:submit.prevent="login"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-container>
                      <p class="text-muted text-center"></p>
                      <CInput
                        placeholder="Username"
                        autocomplete="username "
                        v-model="username"
                        required
                      >
                        <template #prepend-content
                          ><CIcon name="cil-user"
                        /></template>
                      </CInput>
                      <CInput
                        placeholder="Password"
                        type="password"
                        autocomplete="curent-password"
                        v-model="password"
                        required
                      >
                        <template #prepend-content
                          ><CIcon name="cil-lock-locked"
                        /></template>
                      </CInput>
                      <CRow>
                        <CCol class="text-center">
                          <CButton type="submit" color="success" class="px-4"
                            >Login</CButton
                          >
                        </CCol>
                      </CRow>
                    </v-container>
                  </v-form>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import swal from "sweetalert2";
export default {
  name: "Login",
  data: () => ({
    username: "",
    password: "",
    valid: true,
    loading: false,
  }),
  methods: {
    login() {
      // call login action
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          console.log(this.username);
          swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "  Login success",
            showConfirmButton: false,
            showCloseButton: false,
            timer: 1500,
          });
          this.$router.push("/dashboard");
        })
        .catch((e) => {
          this.loading = false;
          swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: "Error",
            text: e.message,
            showConfirmButton: false,
            showCloseButton: false,
            timer: 2000,
          });
        });
    },
  },
};
</script>
