const axios = require('axios');

const apiKey = "aff_8b8143909b6c3fe8a71992c20995077287ea72a4";

async function findWorkspace() {
  try {
    const orgsRes = await axios.get("https://api.affinda.com/v3/organizations", {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    
    if (orgsRes.data.length > 0) {
      const orgId = orgsRes.data[0].identifier;
      const workspacesRes = await axios.get(`https://api.affinda.com/v3/workspaces?organization=${orgId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      
      if (workspacesRes.data.length > 0) {
        process.stdout.write("FOUND_WORKSPACE_ID=" + workspacesRes.data[0].identifier);
      } else {
        process.stdout.write("No workspaces found");
      }
    } else {
      process.stdout.write("No organizations found");
    }
  } catch (err) {
    process.stderr.write("Affinda Fetch Error:" + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
  }
}

findWorkspace();
