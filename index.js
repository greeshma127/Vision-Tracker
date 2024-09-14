import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express();
const port=3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "vision_tracker",
    password: "password",
    port: 5432,
  });

db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
});

app.get("/", async(req, res) => {
    //res.render("index.ejs");
    const result=await db.query("SELECT * FROM vision_details");
    const details=result.rows;
    //console.log(details);
    res.render("index.ejs",{details:details});
});

app.get("/add",async(req,res)=>{
    res.render("add.ejs");
})

app.post("/add",async(req,res)=>{
    const { r_sph, r_cyl, l_sph, l_cyl, remarks, date } = req.body;

  try {
    await db.query(
      "INSERT INTO vision_details (r_sph, r_cyl, l_sph, l_cyl, remarks, date) VALUES ($1, $2, $3, $4, $5, $6)",
      [r_sph, r_cyl, l_sph, l_cyl, remarks, date]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting data into the database");
  }
})

app.get("/delete",async(req,res)=>{
    const result=await db.query("SELECT * FROM vision_details");
    const details=result.rows;
    res.render("delete.ejs",{details:details});
})

app.post("/delete", async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).send("No record selected for deletion.");
    }
  
    try {
      await db.query("DELETE FROM vision_details WHERE id = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting data from the database");
    }
  });

