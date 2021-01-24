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
      <CCol class="department-input">
        <CCardBody>
          <CCard>
            <CCardHeader>
              <h4>Department Manager</h4>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput placeholder="ID" v-model="department_id" required>
                  <template #prepend-content></template>
                </CInput>
                <CInput placeholder="Name" v-model="department_name" required>
                  <template #prepend-content></template>
                </CInput>
                <CInput
                  placeholder="Phone Number"
                  v-model="phone_number"
                  required
                >
                  <template #prepend-content></template>
                </CInput>
                <div class="form-group form-actions">
                  <CButton size="sm" color="success">Submit</CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCardBody>
      </CCol>
      <CCol lg="12" class="department-table">
        <CCardBody>
          <CDataTable
            :items="Departments"
            :fields="fields"
            table-filter
            items-per-page-select
            :items-per-page="10"
            sorter
            pagination
          >
            <template #Edit="{ item }">
              <td class="py-2">
                <CButton
                  @click="(toggled = true), getDepartmentDetail(item)"
                  color="info"
                  square
                  size="sm"
                  variant="outline"
                  >Edit</CButton
                >
              </td>
            </template>
            <template #Delete="{ item }">
              <td class="py-2">
                <CButton
                  @click="deleteDepartment(item)"
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
      <!-- <CModal
        title="Update Department"
        color="success"
        :closeOnBackdrop="false"
        :show.sync="toggled"
      >
        <CForm>
          <CInput placeholder="ID" v-model="department_id_update" disabled>
            <template #prepend-content></template>
          </CInput>
          <CInput placeholder="Name" v-model="department_name_update" required>
            <template #prepend-content></template>
          </CInput>
        </CForm>
        <template #footer>
          <CButton @click="toggled = false" color="secondary">Cancel</CButton>
          <CButton
            @click="(toggled = false), updateDepartment()"
            color="success"
            >Submit</CButton
          >
        </template>
      </CModal> -->
    </div>
  </div>
</template>

<script>
import { getAPI } from "../../api/axios-base";
import swal from "sweetalert2";
import { RingLoader } from "@saeris/vue-spinners";
import { mapState } from "vuex";
var Departments = [];
const fields = [
  { key: "department_id", label: "Department ID" },
  { key: "department_name", label: "Department Name" },
  { key: "phone_number", label: "Phone Number", sorter: false },
  { key: "Edit", sorter: false, _style: "width:2%" },
  { key: "Delete", sorter: false, _style: "width:3%" },
];
export default {
  name: "Department",
  data() {
    return {
      loading: true,
      Departments: Departments.map((Department) => {
        return { ...Department };
      }),
      fields,
      //
      department_id: "",
      department_name: "",
      phone_number: "",
      //
      department_id_update: "",
      department_name_update: "",
      phone_number_update: "",
    };
  },
  methods: {
    getDepartment() {
      getAPI
        .get("departments/", {
          headers: { Authorization: `Bearer ${this.$store.state.accessToken}` },
        })
        .then((response) => {
          this.Departments = response.data;
          this.loading = false;
        });
    },
  },
  created() {
    this.getDepartment();
  },
};
</script>