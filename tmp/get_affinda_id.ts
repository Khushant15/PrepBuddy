import { AffindaAPI, AffindaCredential } from "@affinda/affinda";

const credential = new AffindaCredential("aff_8b8143909b6c3fe8a71992c20995077287ea72a4");
const client = new AffindaAPI(credential);

async function findWorkspace() {
  try {
    const organizations = await client.listOrganizations();
    if (organizations.length > 0) {
      const orgId = organizations[0].identifier;
      const workspaces = await client.listWorkspaces(orgId);
      if (workspaces.length > 0) {
        console.log("FOUND_WORKSPACE_ID=" + workspaces[0].identifier);
      } else {
        console.log("No workspaces found in org " + orgId);
      }
    } else {
      console.log("No organizations found");
    }
  } catch (err) {
    console.error("Affinda Fetch Error:", err);
  }
}

findWorkspace();
