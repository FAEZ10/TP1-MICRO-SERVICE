const express = require('express');
const bodyParser = require('body-parser');
const { Eureka } = require('eureka-js-client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8761;

const registeredServices = {};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const generateDashboardHtml = () => {
  const services = Object.keys(registeredServices).map(appId => {
    const instances = registeredServices[appId].map(instance => {
      return `
        <tr>
          <td>${appId}</td>
          <td>${instance.hostName || instance.instance?.hostName}</td>
          <td>${instance.port?.$  || instance.instance?.port?.$}</td>
          <td>${instance.status || 'UP'}</td>
          <td>${new Date(instance.lastUpdatedTimestamp || Date.now()).toLocaleString()}</td>
        </tr>
      `;
    }).join('');
    return instances;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Eureka Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .refresh { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>Eureka Server Dashboard</h1>
      <div class="refresh">
        <button onclick="location.reload()">Refresh</button>
        <span>Last updated: ${new Date().toLocaleString()}</span>
      </div>
      <h2>Registered Services</h2>
      <table>
        <tr>
          <th>Service Name</th>
          <th>Host</th>
          <th>Port</th>
          <th>Status</th>
          <th>Last Updated</th>
        </tr>
        ${services.length ? services : '<tr><td colspan="5">No services registered</td></tr>'}
      </table>
    </body>
    </html>
  `;
};

app.get('/', (req, res) => {
  res.send(generateDashboardHtml());
});

app.post('/eureka/apps/:appId', (req, res) => {
  const { appId } = req.params;
  const serviceInfo = req.body;
  
  if (!registeredServices[appId]) {
    registeredServices[appId] = [];
  }
  
  registeredServices[appId].push(serviceInfo);
  console.log(`Service registered: ${appId}`);
  console.log(JSON.stringify(serviceInfo, null, 2));
  
  res.status(204).send();
});

app.get('/eureka/apps', (req, res) => {
  res.json({
    applications: {
      application: Object.keys(registeredServices).map(appId => ({
        name: appId,
        instance: registeredServices[appId]
      }))
    }
  });
});

app.get('/eureka/apps/:appId', (req, res) => {
  const { appId } = req.params;
  
  if (!registeredServices[appId]) {
    return res.status(404).json({ error: `Service ${appId} not found` });
  }
  
  res.json({
    application: {
      name: appId,
      instance: registeredServices[appId]
    }
  });
});

app.delete('/eureka/apps/:appId/:instanceId', (req, res) => {
  const { appId, instanceId } = req.params;
  
  if (!registeredServices[appId]) {
    return res.status(404).json({ error: `Service ${appId} not found` });
  }
  
  const initialLength = registeredServices[appId].length;
  registeredServices[appId] = registeredServices[appId].filter(
    instance => instance.instanceId !== instanceId
  );
  
  if (registeredServices[appId].length === initialLength) {
    return res.status(404).json({ error: `Instance ${instanceId} not found` });
  }
  
  console.log(`Service deregistered: ${appId}/${instanceId}`);
  res.status(200).json({ message: 'Service deregistered successfully' });
});

app.put('/eureka/apps/:appId/:instanceId', (req, res) => {
  const { appId, instanceId } = req.params;
  
  if (!registeredServices[appId]) {
    return res.status(404).json({ error: `Service ${appId} not found` });
  }
  
  const instance = registeredServices[appId].find(
    instance => instance.instanceId === instanceId
  );
  
  if (!instance) {
    return res.status(404).json({ error: `Instance ${instanceId} not found` });
  }
  
  instance.lastUpdatedTimestamp = Date.now();
  res.status(200).json({ message: 'Heartbeat received' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Eureka Server running on port ${PORT}`);
});

setInterval(() => {
  const now = Date.now();
  const EXPIRY_TIME = 90000; // 90 seconds
  
  Object.keys(registeredServices).forEach(appId => {
    registeredServices[appId] = registeredServices[appId].filter(instance => {
      const isExpired = now - instance.lastUpdatedTimestamp > EXPIRY_TIME;
      if (isExpired) {
        console.log(`Service expired: ${appId}/${instance.instanceId}`);
      }
      return !isExpired;
    });
    
    if (registeredServices[appId].length === 0) {
      delete registeredServices[appId];
    }
  });
}, 30000);
