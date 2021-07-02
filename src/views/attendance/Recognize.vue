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
    <div v-show="!loading" class="checkin">
      <CRow></CRow>
      <CRow>
        <CCol sm="8" class="recognize-form">
          <div class="checkin-block">
            <div class="recognize-header">
              <section class="section">
                <p class="text-header" v-text="currentTime"></p>
              </section>
            </div>
            <div class="checkin-status container">
              <div class="row status-bar">
                <div class="col-4">
                  <p class="text-header">{{ EmployeeInfo.department_name }}</p>
                </div>
                <div class="col-4">
                  <p class="text-header">
                    {{ EmployeeInfo.first_name }} {{ EmployeeInfo.last_name }}
                  </p>
                </div>
                <div class="col-4">
                  <p class="text-header">{{ EmployeeInfo.employee_id }}</p>
                </div>
              </div>
            </div>
            <div style="margin-top: 30px">
              <!-- --------------------------------------------------------------------------------->
              <div id="app">
                <div class="camera-stream">
                  <video
                    ref="video"
                    id="video"
                    width="1450"
                    height="1115"
                    autoplay
                    v-on:play="detectFace"
                  ></video>
                  <canvas id="overlay" width="1450" height="1115" />
                  <br />
                </div>
              </div>
              <!-- --------------------------------------------------------------------------------->
            </div>
          </div>
        </CCol>
        <CCol sm="4" class="recognize-form">
          <div class="checkin-block">
            <div class="recognize-header">
              <section class="section">
                <p class="text-header">HUTECH MANPOWER TRAINING CENTER</p>
              </section>
            </div>

            <div>
              <div>
                <!-- <img style="width:90%; margin:20px" /> -->
                <template v-if="EmployeeInfo.profile_image != ''">
                  <img
                    id="profileImage"
                    style="
                      height: 650px;
                      width: 650px;
                      padding: 23px;
                      background: #ffffff3b;
                      margin-top: 20px;
                    "
                    v-bind:src="EmployeeInfo.profile_image"
                  />
                </template>
                <template v-else>
                  <img
                    id="profileImage"
                    style="
                      height: 650px;
                      width: 650px;
                      padding: 23px;
                      background: #ffffff3b;
                      margin-top: 20px;
                    "
                    src="https://dummyimage.com/650x650/fff/fff.jpg"
                  />
                </template>

                <img
                  id="checkinImage"
                  style="
                    height: 470px;
                    width: 650px;
                    padding: 23px;
                    background: #ffffff3b;
                    margin-top: 15px;
                    margin-bottom: 10px;
                  "
                />
                <div class="recoginze-button">
                  <CButton color="success" @click="saveCheckin">SAVE</CButton>
                  <CButton @click="clearResults" color="danger">CANCEL</CButton>
                </div>
              </div>
              <!-- <img style="width:90%; margin:20px" v-bind:src="Media+EmployeeProfile.ProfileImage" /> -->
              <!-- <canvas style="height:75vh; width:90%; margin: 20px; background:white"></canvas> -->
            </div>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <div class="checkin-footer">
          <span class="ml-auto">Hutech Management</span>
          <span class="mr-1">&copy; {{ new Date().getFullYear() }} by</span>
          <a href="https://mypeaga.xyz" target="_blank">Peaga inc.</a>
        </div>
      </CRow>
    </div>
  </div>
</template>
<script>
import { getAPI } from "../../api/axios-base";
import "babel-polyfill"; // es6 shim
// import { EmployeeAttendanceRef, StudentCheckinRef } from "./firebase";
import swal from "sweetalert2";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
var facedescriptions = [];
var facelabels = [];
var labeledFaceDescriptors = [];
var isCheckin = [];
var processingFace = "";
var moment = require("moment");
var Employees = [];
export default {
  name: "Department",
  data() {
    return {
      Media: "",
      loading: true,
      currentTime: null,
      EmployeeInfo: {
        employee_id: "EMPLOYEE ID",
        department_name: "DEPARTMENT",
        profile_image: "",
        first_name: "EMPLOYEE",
        last_name: "NAME",
      },
    };
  },

  methods: {
    updateCurrentTime() {
      this.currentTime = moment().format("LLLL");
    },
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
    async loadLabelData() {
      return Promise.all(
        facelabels.map(async (label, i, facelabels) => {
          var descriptions = [];
          var strdescription = facedescriptions[i];
          var arrdescription = strdescription.split(",");
          descriptions.push(new Float32Array(arrdescription));
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    },

    getDataLabelAndDescription() {
      getAPI
        .get("employees/", {
          headers: { Authorization: `Bearer ${this.$store.state.accessToken}` },
        })
        .then(async (response) => {
          Employees = response.data;
          for (var i = 0; i < Employees.length; i++) {
            facelabels.push(Employees[i].employee_id);
            facedescriptions.push(Employees[i].encode);
          }
          labeledFaceDescriptors = await this.loadLabelData();
        });
    },

    getInfo(employee_id) {
      this.EmployeeInfo = Employees.find(
        (index) => index.employee_id === employee_id
      );
    },
    detectFace() {
      let self = this;
      const video = document.getElementById("video");
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4);
      video.onloadeddata = function () {
        const canvas = document.getElementById("overlay");
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
        setInterval(async () => {
          const detections = await faceapi
            .detectSingleFace(video, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (typeof detections !== "undefined") {
            const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
            if (
              bestMatch.label != "unknown" &&
              bestMatch.label != processingFace
            ) {
              self.getInfo(bestMatch.label);
              const video = document.getElementById("video");
              const imgwidth = 604;
              const imgheight = 424;
              const canvas = document.createElement("canvas");
              canvas.width = imgwidth;
              canvas.height = imgheight;
              canvas
                .getContext("2d")
                .drawImage(video, 0, 0, imgwidth, imgheight);
              var checkinImg = document.getElementById("checkinImage");
              checkinImg.src = canvas.toDataURL();
              processingFace = bestMatch.label;
            }
            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );
            canvas
              .getContext("2d")
              .clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
          } else {
            processingFace = "";
            self.clearResults();
            canvas
              .getContext("2d")
              .clearRect(0, 0, canvas.width, canvas.height);
          }
        }, 1000);
      };
    },

    clearResults() {
      var checkinImg = document.getElementById("checkinImage");
      checkinImg.src = "https://dummyimage.com/650x470/fff/fff.jpg";
      this.EmployeeInfo = {
        employee_id: "EMPLOYEE ID",
        department_name: "DEPARTMENT",
        profile_image: "",
        first_name: "EMPLOYEE",
        last_name: "NAME",
      };
    },
    saveCheckin() {
      var employee = this.EmployeeInfo.employee_id;
      var time = moment().format("YYYY-MM-DD hh:mm");
      var campus = "E";

      if (employee != "EMPLOYEE ID") {
        const image = document.getElementById("checkinImage").src;
        var Index = -1;
        if (isCheckin.length != 0) {
          Index = isCheckin.findIndex((index) => index.employee === employee);
        }
        if (Index == -1) {
          let data = {
            checkin_image: image,
            checkin_time: time,
            employee: employee,
            campus: campus,
          };
          console.log(data);
          getAPI.post("/employeetimesheets/", data).then((response) => {
            var checkinID = response.data.attendance_id;
            isCheckin.push({ employee: employee, attendance_id: checkinID });
            this.clearResults();
            this.successAlert("Check-in success");
          });
        } else {
          var checkoutID = isCheckin[Index].attendance_id;
          console.log(checkoutID);
          let data = {
            status: 2,
            checkout_time: time,
            checkout_image: image,
          };
          getAPI
            .patch(`/employeetimesheets/${checkoutID}/`, data)
            .then((response) => {
              isCheckin.splice(Index, 1);
              this.clearResults();
              this.successAlert("Check-out success");
            });
        }
      }
    },
  },
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }
  },
  created() {
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]).then(() => {
      setTimeout(() => {
        this.loading = false;
      }, 10000);
    });
    this.getDataLabelAndDescription();
  },
};
</script>
