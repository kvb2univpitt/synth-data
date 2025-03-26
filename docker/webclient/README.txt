docker build -t kvb2univpitt/i2b2-webclient-demo-synthdata:v1.8.1a.2025.03 .;docker run -d --name=i2b2-webclient-demo --network i2b2-demo-net -p 80:80 -p 443:443 kvb2univpitt/i2b2-webclient-demo-synthdata:v1.8.1a.2025.03

docker stop i2b2-webclient-demo;docker rm i2b2-webclient-demo;docker rmi kvb2univpitt/i2b2-webclient-demo-synthdata:v1.8.1a.2025.03
