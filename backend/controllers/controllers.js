import express from 'express';
import db from '../database/db.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'ljkeycookiehidden30';
import multer from 'multer';
export const fetchProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    // Execute a SQL query to fetch the project data by ID
    const sql = 'SELECT * FROM images WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error fetching project:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Check if project with specified ID was found
      if (result.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Extract the project data from the SQL result
      const project = result[0];

      // Respond with the project data as JSON
      res.status(200).json(project);
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '15m' });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    secure: true,
    path: "/api"
  }).status(statusCode).json({
    success: true,
    message,
  });
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Handle multiple file uploads with different field names
const uploadMultiple = upload.fields([
  { name: 'files' },
  { name: 'singleFile', maxCount: 1 }
]);
export const uploadData = (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'File upload failed' });
    }

    const fourImageArray = req.body.four_image_array || [];
    const nineImageArray = req.body.nine_image_array || [];
    const title = req.body.title || '';
    const clientName = req.body.client_name || '';
    const work = req.body.work || '';
    const descpOne = req.body.descp_one || '';
    const projectTitle = req.body.project_title || '';
    const descpTwo = req.body.descp_two || '';
    const sectionTitle = req.body.section_title || '';
    const impFeatures = req.body.imp_features || '';
    const sectionTitleTwo = req.body.section_title_two || '';
    const impFeaturesTwo = req.body.imp_features_two || '';
    const url = req.body.url || '';

    // Get the filename of the single file
    const singleFile = req.files.singleFile
      ? req.files.singleFile[0].originalname
      : '';

    const sql = `INSERT INTO images (four_image_array, nine_image_array, single_image, title, client_name, work, descp_one, project_title, descp_two, section_title, imp_features, section_title_two, imp_features_two, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if (!req.files || (Object.keys(req.files).length === 0 && req.files.constructor === Object)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filePaths = req.files.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

    db.query(
      sql,
      [JSON.stringify(fourImageArray), JSON.stringify(nineImageArray), singleFile, title, clientName, work, descpOne, projectTitle, descpTwo, sectionTitle, impFeatures, sectionTitleTwo, impFeaturesTwo, url],
      (err, data) => {
        if (err) {
          console.log('Error inserting data:', err);
          return res.status(500).json({ error: err.message });
        }

        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully.', filePaths });
      }
    );
  });
};

export const logoutNew = async (req, res) => {
  try {
    res.clearCookie('token', { path: '/api' });
    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Failed to logout. Please try again.' });
  }
};

export const loginNew = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM login WHERE `email` = ? AND `password` = ?';

  db.query(sql, [email, password], async (err, data) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (data.length > 0) {
      const user = data[0];
      sendCookie(user, res, 'Login successful');
    } else {
      return res.json('failed');
    }
  });
};
export const fetchImages = async (req, res) => {
  try {
    const sql = `SELECT * FROM images`; // Query to fetch all images
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching images:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Process the result from the database query
      const images = result.map(row => ({
        id: row.Id,
        four_image_array: JSON.parse(row.four_image_array),
        nine_image_array: JSON.parse(row.nine_image_array),
        single_image: row.single_image,
        title: row.title,
        client_name: row.client_name,
        work: row.work,
        descp_one: row.descp_one,
        project_title: row.project_title,
        descp_two: row.descp_two,
        section_title: row.section_title,
        imp_features: row.imp_features,
        section_title_two: row.section_title_two,
        imp_features_two: row.imp_features_two,
        url: row.url
      }));

      // Send the processed images array as JSON response
      res.json(images);
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const userDataRoute = async (req, res) => {
  try {
    const sql = `SELECT * FROM login`;
    const data = await db.query(sql);
    res.json(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateData = async(req,res)=>{
  const { id } = req.params;
  const updatedItem = req.body;
  db.query('UPDATE images SET ? WHERE id = ?', [updatedItem, id], (error, result) => {
      if (error) {
          console.error('Error updating data:', error);
          res.status(500).json({ message: 'Error updating data' });
      } else {
          res.json({ message: 'Data updated successfully' });
      }
  });
}



export const deleteData =async(req,res)=>{
  const { id } = req.params;
    db.query('DELETE FROM images WHERE id = ?', id, (error, result) => {
        if (error) {
            console.error('Error deleting data:', error);
            res.status(500).json({ message: 'Error deleting data' });
        } else {
            res.json({ message: 'Data deleted successfully' });
        }
    });
}