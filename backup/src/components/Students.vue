<template>
    <div>
      <div class="header-background"></div> <!-- 添加背景图片的div -->
      <div class="container">
        <div class="header">
          <h1>学生管理系统</h1>
        </div>
        <div class="button-group">
          <el-button @click="addStudentDialogVisible = true" type="primary" class="custom-button">添加学生</el-button>
          <el-button @click="fetchStudents" type="success" class="custom-button">查询所有学生</el-button>
          <el-button @click="searchStudentDialogVisible = true" type="primary" class="custom-button">查询学生ID</el-button>
        </div>
        <div class="content">
          <div v-if="students.length > 0" class="table-wrapper">
            <el-table :data="students" class="custom-table" style="width: 100%; margin: auto;" height="400">
              <el-table-column prop="id" label="ID" min-width="80" class="custom-column"></el-table-column>
              <el-table-column prop="姓名" label="姓名" min-width="150" class="custom-column"></el-table-column>
              <el-table-column prop="年龄" label="年龄" min-width="100" class="custom-column"></el-table-column>
              <el-table-column prop="专业" label="专业" min-width="150" class="custom-column"></el-table-column>
              <el-table-column label="操作" min-width="200" class="custom-column">
                <template v-slot="scope">
                  <el-button @click="editStudent(scope.row)" type="primary" size="small" class="custom-button">编辑</el-button>
                  <el-button @click="deleteStudent(scope.row.id)" type="danger" size="small" class="custom-button">删除</el-button>
                </template>
              </el-table-column>
            </el-table>   
          </div>
          <el-empty v-else description="无学生数据"></el-empty>
        </div>
    
        <el-dialog v-model="addStudentDialogVisible" title="添加/编辑学生" :destroy-on-close="true" class="custom-dialog">
          <el-form :model="newStudent" class="pink-form">
            <el-form-item label="姓名">
              <el-input v-model="newStudent.姓名"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="newStudent.年龄" type="number"></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="newStudent.专业"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addStudentDialogVisible = false;clearNewStudent()" class="custom-button">取消</el-button>
            <el-button @click="saveStudent" type="primary" class="custom-button">保存</el-button>
          </div>
        </el-dialog>
        
        <el-dialog v-model="searchStudentDialogVisible" title="查询学生" :destroy-on-close="true" class="custom-dialog">
          <el-form>
            <el-form-item label="学生ID">
              <el-input v-model="searchId" placeholder="输入学生ID" class="pink-input"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="searchStudentDialogVisible = false" class="custom-button">取消</el-button>
            <el-button @click="fetchStudentById" type="primary" class="custom-button">查询</el-button>
          </div>
        </el-dialog>
        
        <!-- 当创建和编辑学生信息不完整时显示错误消息 -->
        <el-message v-if="showErrorMessage" type="error" show-close message="请填写完整信息"></el-message>
      </div>
    </div>
  </template>
  
  

<script setup lang='ts'>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

interface Student {
  id: number;
  姓名: string;
  年龄: number;
  专业: string;
}

const students = reactive([] as Array<Student>);
const newStudent = reactive<Student>({ id: 0, 姓名: '', 年龄: 0, 专业: '' });
const addStudentDialogVisible = ref(false);
const searchStudentDialogVisible = ref(false);
const showErrorMessage = ref(false);
const searchId = ref<string | null>(null);

const fetchStudents = async () => {
  try {
    searchId.value = null;
    const response = await axios.get('http://localhost:5001/students');
    students.splice(0, students.length, ...response.data);
  } catch (error) {
    console.error('查询出错 ', error);
  }
};

const fetchStudentById =  async () => {
  if (!searchId.value) {
    return;
  }
  try {
    const response = await axios.get(`http://localhost:5001/students/${searchId.value}`);
    students.splice(0, students.length, response.data);
    searchStudentDialogVisible.value = false;
  } catch (error) {
    console.error('查询出错 ', error);
  }
};

const saveStudent = async () => {
  try {
    // 确保所有字段都有值
    if (!newStudent.姓名 || !newStudent.年龄 || !newStudent.专业) {
      showErrorMessage.value = true;
      return;
    }

    if (newStudent.id === 0) {
      // 添加新学生信息
      await axios.post('http://localhost:5001/students', newStudent);
    } else {
      // 更新编辑后的学生信息
      await axios.put(`http://localhost:5001/students/${newStudent.id}`, newStudent);
    }

    addStudentDialogVisible.value = false;
    fetchStudents();

    // 保存成功后清空 newStudent 对象
    clearNewStudent();
  } catch (error) {
    console.error('保存失败', error);
  }
};

const editStudent = (student: Student) => {
  newStudent.id = student.id;
  newStudent.姓名 = student.姓名;
  newStudent.年龄 = student.年龄;
  newStudent.专业 = student.专业;
  addStudentDialogVisible.value = true;
};

const clearNewStudent = () => {
  newStudent.id = 0;
  newStudent.姓名 = '';
  newStudent.年龄 = 0;
  newStudent.专业 = '';
};

const deleteStudent = async (id: number) => {
  try {
    await axios.delete(`http://localhost:5001/students/${id}`);
    fetchStudents();
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&display=swap');

* {
  font-family: 'Raleway', sans-serif;
}

body, html {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
  position: relative;
  z-index: 1;
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/background.jpg') no-repeat center center fixed;
  background-size: cover;
  opacity: 0.8;
  z-index: -1;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%; /* 根据需要调整高度 */
  background: url('../../public/1313754.png') no-repeat center center;
  background-size: cover;
  z-index: 0; /* 确保在内容后面 */
  opacity: 0.8; /* 根据需要调整透明度 */
}

.container {
  max-width: 1200px;
  margin: 400px auto; /* 调整 margin-top 使其垂直居中 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  background: rgba(255, 240, 245, 0.6); /* 设置为半透明 */
  position: relative;
  z-index: 2; /* 保证内容在背景图片上方 */
}

.header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.header h1 {
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  font-size: 3rem;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.custom-button {
  background-color: #ff69b4;
  border-color: #ff69b4;
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 30px;
  padding: 10px 20px;
  margin: 5px;
}

.custom-button:hover {
  background-color: #ff1493;
  border-color: #ff1493;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.content {
  padding: 20px;
  background: rgba(255, 240, 245, 0.6); /* 设置为半透明 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3; /* 保证内容在背景图片上方 */
}

.table-wrapper {
  width: 100%;
  max-height: calc(100vh - 200px);
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-table .el-table__header-wrapper {
  background-color: rgba(255, 182, 193, 0.6); /* 设置为半透明 */
  border-radius: 10px 10px 0 0;
}

.custom-table .el-table__body-wrapper {
  background-color: rgba(255, 240, 245, 0.6); /* 设置为半透明 */
  border-radius: 0 0 10px 10px;
}

.custom-column:hover .cell {
  color: #ff1493;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.custom-table .el-table__header th {
  color: #ff1493;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.custom-table .el-table__body tr:hover .cell {
  transform: scale(1.5); /* 放大1.5倍 */
}

.custom-table .el-table__body tr:hover {
  background-color: rgba(255, 192, 203, 0.6) !important;
  z-index: 1;
  position: relative;
}

.custom-dialog {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border-radius: 10px;
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}

.pink-input .el-input__inner {
  border-color: #ff69b4;
}

.pink-button {
  background-color: #ff69b4;
  border-color: #ff69b4;
  color: white;
}

.pink-button:hover {
  background-color: #ff1493;
  border-color: #ff1493;
}

.pink-form .el-form-item__content .el-input__inner {
  border-color: #ff69b4;
}
</style>





