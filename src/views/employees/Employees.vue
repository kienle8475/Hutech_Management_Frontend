<template>
  <div>
    <div v-if="loading">
      <ring-loader
        class="loading"
        :loading="loading"
        :size="40"
        color="#4A90E2"
      ></ring-loader>
    </div>
    <div v-show="!loading">
      <CCol class="employee-table">
        <CCardHeader>
          <h4>Employees Manager</h4>
        </CCardHeader>
        <CButtonToolbar class="button-toolbar">
          <CButtonGroup size="sm" class="mx-1 button-group">
            <td>
              <CButton class="mx-2" color="success" @click="toggled_add = true"
                >New Employee</CButton
              >
              <CButton
                class="mx-2"
                color="info"
                variant="outline"
                @click="importEmployees()"
                >Import Employees</CButton
              >
              <CButton class="mx-2" color="success" variant="outline">
                <JsonCSV
                  :data="Employees"
                  :name="dataFile"
                  :fiels="export_fields"
                  >Export</JsonCSV
                >
              </CButton>
            </td>
          </CButtonGroup>
        </CButtonToolbar>
        <CCardBody class="data-table">
          <CDataTable
            :items="Employees"
            :fields="fields"
            table-filter
            items-per-page-select
            :items-per-page="5"
            sorter
            pagination
            :noItemsView="{
              noResults: 'No filtering results',
              noItems: 'No items available',
            }"
          >
            <template #full_name="{ item }">
              <td>{{ item.first_name + " " + item.last_name }}</td>
            </template>
            <template #gender="{ item }">
              <td v-if="item.gender == 'M'">Male</td>
              <td v-else>Female</td>
            </template>
            <template #status="{ item }">
              <td v-if="item.status == '1'">Enable</td>
              <td v-else>Disable</td>
            </template>
            <template #profile_image="{ item }">
              <td class="py-2">
                <img
                  height="65"
                  v-bind:src="item.profile_image"
                  onclick="window.open(this.src)"
                  style="cursor: pointer"
                />
              </td>
            </template>

            <template #Edit="{ item }">
              <td class="py-2">
                <CButton
                  @click="(toggled_update = true), getEmployeeDetail(item)"
                  color="info"
                  square
                  size="sm"
                  variant="outline"
                  >Edit</CButton
                >
              </td>
            </template>
            <template #Disable="{ item }">
              <td class="py-2" v-if="item.status == 1">
                <CButton
                  @click="disableEmployee(item)"
                  color="warning"
                  square
                  size="sm"
                  variant="outline"
                  >Disable</CButton
                >
              </td>
              <td class="py-2" v-else>
                <CButton
                  @click="disableEmployee(item)"
                  color="success"
                  square
                  size="sm"
                  variant="outline"
                  >Enable</CButton
                >
              </td>
            </template>
            <template #Delete="{ item }">
              <td class="py-2">
                <CButton
                  @click="deleteEmployee(item)"
                  color="danger"
                  square
                  size="sm"
                  variant="outline"
                  >Delete</CButton
                >
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCol>
      <!-- Modal Create Employee -->
      <CModal
        title="Create Employee"
        color="success"
        :closeOnBackdrop="false"
        :show.sync="toggled_add"
      >
        <CForm>
          <CInput placeholder="ID" v-model="employee_id">
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="First Name" v-model="first_name">
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Last Name" v-model="last_name">
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Birthday" v-model="birthday" type="date">
            <template #prepend-content></template>
          </CInput>
          <select
            class="custom-select custom-select-md mb-3"
            v-model="gender"
            placeholder="Gender"
          >
            <option value disabled selected>Gender</option>
            <option
              v-for="option in genders"
              v-bind:value="option.value"
              v-bind:key="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <select
            class="custom-select custom-select-md mb-3"
            v-model="department"
            placeholder="Department"
          >
            <option value disabled selected>Department</option>
            <option
              v-for="option in Departments"
              v-bind:value="option.department_id"
              v-bind:key="option.department_id"
            >
              {{ option.department_name }}
            </option>
          </select>
          <CInput
            placeholder="Phone Number"
            v-model="phone_number"
            type="number"
          >
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Email" v-model="email" type="Email">
            <template #prepend-content></template>
          </CInput>
          <CButton
            block
            class="btn-add-image"
            color="secondary"
            variant="outline"
            @click="toggle_image"
            >Choose profile image</CButton
          >
          <my-upload
            field="img"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
            v-model="toggled_image"
            :width="800"
            :height="800"
            img-format="png"
            lang-type="en"
            :noCircle="true"
          ></my-upload>
          <div v-if="loading_api">
            <ring-loader
              class="loading"
              :loading="loading_api"
              :size="40"
              color="#4A90E2"
            ></ring-loader>
          </div>
          <div v-show="!loading_api">
            <img
              id="profile_image"
              class="image_profile_upload"
              :src="imgDataUrl"
            />
          </div>
        </CForm>
        <template #footer>
          <CButton
            @click="(toggled_add = false), resetFormInput()"
            color="danger"
            >Cancel</CButton
          >
          <CButton
            @click="(toggled_add = false), createEmployee()"
            color="success"
            v-bind:disabled="!profile_isvalid"
            >Submit</CButton
          >
        </template>
      </CModal>
      <!-- Modal Create Employee -->
      <!-- Modal Update Employee -->
      <CModal
        title="Update Employee"
        color="info"
        :closeOnBackdrop="false"
        :show.sync="toggled_update"
      >
        <CForm>
          <CInput placeholder="ID" v-model="employee_id_update" disabled>
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="First Name" v-model="first_name_update">
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Last Name" v-model="last_name_update">
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Birthday" v-model="birthday_update" type="date">
            <template #prepend-content></template>
          </CInput>
          <select
            class="custom-select custom-select-md mb-3"
            v-model="gender_update"
            placeholder="Gender"
          >
            <option value disabled selected>Gender</option>
            <option
              v-for="option in genders"
              v-bind:value="option.value"
              v-bind:key="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <select
            class="custom-select custom-select-md mb-3"
            v-model="department_update"
            placeholder="Department"
          >
            <option value disabled selected>Department</option>
            <option
              v-for="option in Departments"
              v-bind:value="option.department_id"
              v-bind:key="option.department_id"
            >
              {{ option.department_name }}
            </option>
          </select>
          <CInput
            placeholder="Phone Number"
            v-model="phone_number_update"
            type="number"
          >
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Email" v-model="email_update" type="Email">
            <template #prepend-content></template>
          </CInput>
          <CButton
            block
            class="btn-add-image"
            color="secondary"
            variant="outline"
            @click="toggle_image"
            >Choose profile image</CButton
          >
          <my-upload
            field="img"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
            v-model="toggled_image"
            :width="800"
            :height="800"
            img-format="png"
            lang-type="en"
            :noCircle="true"
          ></my-upload>
          <div v-if="loading_api">
            <ring-loader
              class="loading"
              :loading="loading_api"
              :size="40"
              color="#4A90E2"
            ></ring-loader>
          </div>
          <div v-show="!loading_api">
            <img
              id="profile_image"
              class="image_profile_upload"
              :src="imgDataUrl"
            />
          </div>
        </CForm>
        <template #footer>
          <CButton @click="toggled_update = false" color="secondary"
            >Cancel</CButton
          >
          <CButton
            @click="(toggled_update = false), updateEmployee()"
            color="success"
            >Submit</CButton
          >
        </template>
      </CModal>
      <!-- Modal Update Employee -->
    </div>
  </div>
</template>

<script>
import { getAPI } from "../../api/axios-base";
import swal from "sweetalert2";
import JsonCSV from "vue-json-csv";
import * as faceapi from "face-api.js";
import myUpload from "vue-image-crop-upload/upload-2.vue";
import "babel-polyfill"; // es6 shim

var Employees = [];
var Departments = [];
const fields = [
  { key: "employee_id", label: "ID" },
  { key: "full_name", label: "Full Name" },
  { key: "birthday", label: "Birth", sorter: false },
  { key: "gender", label: "Gender", sorter: false },
  {
    key: "department_name",
    label: "Department",
    sorter: false,
  },
  { key: "phone_number", label: "Phone", sorter: false },
  { key: "email", label: "Email", sorter: false },
  { key: "profile_image", sorter: false },
  { key: "status", label: "Status", sorter: false },
  { key: "Edit", sorter: false, _style: "width:2%" },
  { key: "Disable", sorter: false, _style: "width:3%" },
  { key: "Delete", sorter: false, _style: "width:3%" },
];
const export_fields = [
  "employee_id",
  "first_name",
  "last_name",
  "birthday",
  "gender",
  "department_name",
  "phone_number",
  "profile_image",
  "status",
];
const genders = [
  { value: "F", label: "Female" },
  { value: "M", label: "Male" },
];

export default {
  name: "Employee",
  data() {
    return {
      Employees: Employees.map((employee) => {
        return { ...employee };
      }),
      Departments: Departments.map((Department) => {
        return { ...Department };
      }),

      fields, // field show table
      genders, // gender choice
      export_fields, // export csv
      loading: true, //first loading
      loading_api: false, // face api library loading
      dataFile: "Employees.csv", // export csv file name
      toggled_add: false, // modal create employee
      toggled_update: false, // modal update employee
      toggled_image: false, // show profile image
      profile_isvalid: false, // check profile is valid
      imgDataUrl: "", // data image crop

      // Create Data
      employee_id: "",
      first_name: "",
      last_name: "",
      gender: "",
      birthday: "",
      address: "",
      email: "",
      phone_number: "",
      profile_image: "",
      department: "",

      // Update Data
      employee_id_update: "",
      first_name_update: "",
      last_name_update: "",
      gender_update: "",
      birthday_update: "",
      address_update: "",
      email_update: "",
      phone_number_update: "",
      profile_image_update: "",
      department_update: "",
    };
  },
  components: {
    "my-upload": myUpload,
    JsonCSV: JsonCSV,
  },
  methods: {
    successAlert(message) {
      swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Success",
        text: message,
        showConfirmButton: false,
        timer: 2000,
      });
    },
    errorAlert(message) {
      swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error",
        text: message,
        showConfirmButton: false,
        timer: 2500,
      });
    },
    getEmployee() {
      getAPI
        .get("employees/", {
          headers: { Authorization: `Bearer ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.Employees = response.data;
          this.getDepartment();
          this.loading = false;
          console.log("Data loading success");
        })
        .catch((err) => {
          console.log(err);
          swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Error",
            text: "Network error",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    },
    getEmployeeDetail(item) {
      console.log(item.employee_id);
      this.employee_id_update = item.employee_id;
      this.first_name_update = item.first_name;
      this.last_name_update = item.last_name;
      this.gender_update = item.gender;
      this.birthday_update = item.birthday;
      this.address_update = item.address;
      this.email_update = item.email;
      this.phone_number_update = item.phone_number;
      this.profile_image_update = item.profile_image;
      this.department_update = item.department;
    },
    createEmployee() {
      var data = {
        employee_id: this.employee_id,
        first_name: this.first_name,
        last_name: this.last_name,
        gender: this.gender,
        birthday: this.birthday,
        address: this.address,
        email: this.email,
        phone_number: this.phone_number,
        profile_image: this.imgDataUrl,
        department: this.department,
      };
      console.log(data);
      getAPI
        .post("/employees/", data)
        .then((response) => {
          this.getEmployee();
          console.log(response.data);
          this.successAlert("Employee Created");
          this.resetFormInput();
          this.profile_isvalid = false;
        })
        .catch((e) => {
          console.log(e);
          this.errorAlert("Employee ID invalid or already exists");
        });
    },
    updateEmployee() {
      var data = {
        employee_id: this.employee_id_update,
        first_name: this.first_name_update,
        last_name: this.last_name_update,
        gender: this.gender_update,
        birthday: this.birthday_update,
        address: this.address_update,
        email: this.email_update,
        phone_number: this.phone_number_update,
        department: this.department_update,
      };
      getAPI
        .patch(`/employees/${data.employee_id}/`, data)
        .then((response) => {
          this.getEmployee();
          this.successAlert("Employee Updated");
        })
        .catch((e) => {
          console.log(e);
          this.errorAlert(e);
        });
    },
    disableEmployee(item) {
      var status, status_name;
      if (item.status == 0) {
        status = 1;
        status_name = "Enabled";
      } else {
        status = 0;
        status_name = "Disabled";
      }
      var data = {
        employee_id: item.employee_id,
        first_name: item.first_name,
        last_name: item.last_name,
        gender: item.gender,
        birthday: item.birthday,
        address: item.address,
        email: item.email,
        phone_number: item.phone_number,
        department: item.department,
        status: status,
      };
      getAPI
        .put(`/employees/${item.employee_id}/`, data)
        .then((response) => {
          this.getEmployee();
          this.successAlert(`Employee ${status_name}`);
        })
        .catch((e) => {
          console.log(e);
          this.errorAlert(e);
        });
    },
    deleteEmployee(item) {
      swal
        .fire({
          toast: true,
          position: "top",
          icon: "warning",
          title: "Delete",
          text: `"${item.first_name} ${item.last_name}"`,
          showCancelButton: true,
          showConfirmButton: true,
        })
        .then((result) => {
          if (result.value) {
            var deleteIndex = this.Employees.findIndex(
              (index) => index.employee_id == item.employee_id
            );
            this.Employees.splice(deleteIndex, 1);
            getAPI
              .delete(`employees/${item.employee_id}/`)
              .then((response) => {
                this.successAlert("Employee Deleted");
              })
              .catch((e) => {
                console.log(e);
                this.errorAlert(e);
              });
          }
        });
    },
    getDepartment() {
      getAPI
        .get("departments/", {
          headers: { Authorization: `Bearer ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.Departments = response.data;
        });
    },
    resetFormInput() {
      (this.employee_id = ""),
        (this.first_name = ""),
        (this.last_name = ""),
        (this.gender = ""),
        (this.birthday = ""),
        (this.address = ""),
        (this.email = ""),
        (this.phone_number = ""),
        (this.profile_image = ""),
        (this.department = ""),
        (this.imgDataUrl = "");
    },
    toggle_image() {
      this.toggled_image = !this.toggled_image;
    },
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
      console.log("field: " + field);
      this.imgDataUrl = imgDataUrl;
      this.checkImage();
    },
    cropUploadSuccess(jsonData, field) {
      console.log("-------- upload success --------");
      console.log(jsonData);
      console.log("field: " + field);
    },
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    },
    importEmployees() {
      swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Developing",
        text: "Coming soon",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    async checkImage() {
      this.loading_api = true;
      var detection_score = 0;
      const input = document.getElementById("profile_image");
      console.log(input);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(
        "models/ssd_mobilenetv1_model-weights_manifest.json"
      );
      const detection = await faceapi.detectSingleFace(input);
      // const detection = await faceapi.detectSingleFace(
      //   input,
      //   new faceapi.SsdMobilenetv1Options()
      // );
      // .withFaceLandmarks()
      // .withFaceDescriptor();
      if (detection != null && detection._score > 0.98) {
        detection_score = Math.floor(detection._score * 100);
        this.loading_api = false;
        this.profile_isvalid = true;
        swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Detect a face with score: ${detection_score}%`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        this.profile_isvalid = false;
        this.loading_api = false;
        swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "No face detection",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
  },
  created() {
    this.getEmployee();
  },
};
</script>