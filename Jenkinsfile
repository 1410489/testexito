pipeline {
    agent any
    tools {
        nodejs 'Node16'
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npx cucumber-js'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: '**/traces/**', fingerprint: true
            junit '**/reports/**/*.xml'
        }
    }
}
