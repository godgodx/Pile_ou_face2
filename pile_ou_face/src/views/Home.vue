<template>
  <div class="home-container">
    <!-- Barre de navigation -->
    <nav class="navbar">
      <div class="logo">
        <h1>Pile ou Face</h1>
      </div>
      <ul class="nav-links">
        <li><a href="#">Accueil</a></li>
        <li><a href="#">Parier</a></li>
        <li><a href="#">Historique</a></li>
        <li><a href="#">Profil</a></li>
        <li><a href="#" @click.prevent="logout">Déconnexion</a></li>
      </ul>
    </nav>

    <!-- Informations utilisateur -->
    <div class="user-info">
      <h2>Bienvenue, {{ userInfo.email }}</h2>
      <p><strong>Rôle :</strong> {{ userInfo.role }}</p>
      <p><strong>Jetons actuels :</strong> {{ userInfo.balance }}</p>
    </div>

    <div class="content">
      <h2>Bienvenu sur pile ou face !</h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userInfo: {
        email: "",
        role: "",
        balance: 0,
      },
    };
  },
  methods: {
    async fetchUserInfo() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          this.userInfo = response.data.user;
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur :", error);
        this.$router.push("/");
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
  created() {
    this.fetchUserInfo();
  },
};
</script>

<style scoped>
/* Styles pour la barre de navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin: 0 15px;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #ffcc00;
}

.user-info {
  margin: 20px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-info h2 {
  margin: 0 0 10px;
  color: #333;
}

.user-info p {
  margin: 5px 0;
  font-size: 1rem;
}

.content {
  text-align: center;
  margin-top: 30px;
}

.content h2 {
  font-size: 2rem;
  color: #007bff;
}
</style>
