<template>
  <div>
    <div style="text-align:center">
      <h1>Auto Passport Genenrator</h1>
      <p>Upload Image of Face and Specify Dimensions for Passport Photograph Below</p>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-6">
            <form enctype="multipart/form-data">
                <div class="form-group">
                    <label for="">Name:</label>
                    <input type="text" required class="form-control" placeholder="eg Chris" name="subject_name" v-model="model.name">
                </div>

                <div class="form-group">
                    <label for="">File:</label>
                    <input type="file" class="form-control" accept="image/*" name="image" v-on:change="upload($event.target.files)">
                </div>

                <div class="form-group">
                    {{ loading }}
                    {{ uploadStatus }}
                </div>
            </form>
        </div>

        <div class="col-md-6">
            <p style="text-align:center;"><strong>Image Preview</strong></p>
            <div class="col-md-6" style="text-align:center;">
                <img id="face_preview1" class="img-responsive" alt="" width="200" height="200">
            </div>

            <template v-if="passport_pic != null">
              <div class="col-md-6" style="text-align:center;">
                <img :src="passport_pic" class="img-responsive" alt="" width="200" height="200">
              </div>  
            </template>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
            <label for="">Height (px)</label>
            <input type="number" class="form-control" placeholder="600" v-model="height">
        </div>

        <div class="col-md-3">
          <label for="">Width (px)</label>
          <input class="form-control" type="number" placeholder="400" v-model="width">
        </div>

        <template v-if="passport_pic != null">
          <div class="col-md-6">
            <label for="">Passport URL</label>
            <input class="form-control" readonly="readonly" :value="passport_pic">
          </div>
        </template>
      </div>

      <div style="margin-top: 20px; ">
        <input type="button" class="btn btn-primary" value="Generate Passport" v-on:click="onSubmit">
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      model: {
        name: "",
        image: null
      },
      height: 300,
      width: 200,
      loading: "",
      uploadStatus: "",
      passport_pic: null
    };
  },
  methods: {
    upload: function(files) {
      this.model.image = files[0];
      this.uploadStatus = "";
      this.showPreview(files[0]);
    },
    showPreview: function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("face_preview1").src = e.target.result;
      };
      // read the image file as a data URL.
      reader.readAsDataURL(file);
    },
onSubmit: function() {
      // Assemble form data
      this.uploadStatus = "";
      const formData = new FormData();
      formData.append("image", this.model.image);
      formData.append("width", this.width);
      formData.append("height", this.height);
      this.loading = "Processing....Please be patient.";
      // Post to server
      axios.post("http://localhost:3128/upload", formData).then(res => {
        this.loading = "";
        // Update UI
        if (res.data.error) {
          this.uploadStatus = res.data.error;
          alert(this.uploadStatus);
        } else {
          this.passport_pic = res.data.url;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
