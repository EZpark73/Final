pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Prepare Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASS'),
                    string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASS')
                ]) {
                    sh """
                    cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
MYSQL_DATABASE=itemdb
MYSQL_USER=itemuser
MYSQL_PASSWORD=${MYSQL_PASS}
MYSQL_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3001
DB_PORT=3306
FRONTEND_PORT=3000
API_HOST=http://192.168.56.1:3001
EOF
                    """
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker compose down -v'
                sh 'docker compose build'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                sh "sleep 10"
                sh "curl -f http://localhost:3001/health"
                sh "curl -f http://localhost:3001/items"
            }
        }
    }

    post {
        success { echo "Deployment OK!" }
    }
}
