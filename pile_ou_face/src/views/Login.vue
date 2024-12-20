<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="title">Connexion</h1>
      <p class="subtitle">Connectez-vous pour accéder à votre compte</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Entrez votre email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button class="login-button" type="submit">Se connecter</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          email: this.email,
          password: this.password,
        });
        if (response.data.success) {
          localStorage.setItem("token", response.data.token); 
          this.$router.push("/home"); 
        } else {
          this.errorMessage = "Email ou mot de passe incorrect.";
        }
      } catch (error) {
        this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      }
    },
  },
};
</script>

<style scoped>
/* Style général pour la page */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #007bff, #6c63ff);
  font-family: 'Arial', sans-serif;
}

.login-container {
  background: white;
  width: 400px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.title {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.subtitle {
  margin: 10px 0 20px;
  font-size: 1rem;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.login-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background: #0056b3;
}

.error {
  color: red;
  margin-top: 15px;
  font-size: 0.9rem;
}
</style>
