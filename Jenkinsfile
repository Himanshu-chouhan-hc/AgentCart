
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Jenkins is checking out AgentCart'
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    bat 'docker build -t agentcart-backend:jenkins .'
                }
            }
        }

        stage('Deploy Container') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'agentcart-database-url',
                        variable: 'DATABASE_URL'
                    )
                ]) {
                    bat '''
                        docker rm -f agentcart-backend-jenkins 2>NUL
                        docker run -d --name agentcart-backend-jenkins -p 5001:5000 -e DATABASE_URL="%DATABASE_URL%" -e NODE_ENV=production agentcart-backend:jenkins
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl.exe --fail http://localhost:5001/api/health'
            }
        }
    }
}
