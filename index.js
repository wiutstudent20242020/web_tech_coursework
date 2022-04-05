let express = require('express');
let app = express();
let sqlite3 = require('sqlite3');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

const db = new sqlite3.Database('./notes.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.log(err.message);

  console.log('Connection successful!');
});

// TABLE creation

// db.run(
//   'CREATE TABLE notes (id INTEGER PRIMARY KEY, description VARCHAR(255), archived int)'
// );

app.get('/home', (req, res) => {
  res.render('home');
});
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/notes', (req, res) => {
  db.all('select * FROM notes WHERE archived = 0', [], (err, rows) => {
    if (err) console.log(err.message);

    res.render('notes', { notes: rows });
  });
});

// adding a new note
app.get('/create', (req, res) => {
  res.render('create');
});
app.post('/create', (req, res) => {
  const userInput = req.body;

  if (userInput.note.length === 0) {
    res.render('create', { notes: rows, error: true });
  } else {
    db.run(
      'insert into notes(description, archived) values (?, 0)',
      [userInput.note],
      (err) => {
        if (err) console.log(err.message);

        console.log('New note added');

        db.all('select * FROM notes WHERE archived = 0', [], (err, rows) => {
          if (err) console.log(err.message);

          res.render('notes', { notes: rows });
        });
      }
    );
  }
});
//////////////////////////////////////////
db.all('select * FROM notes WHERE archived = 0', [], (err, rows) => {
  if (err) console.log(err.message);

  console.log(rows);
});
//////////////////////////////////////////
// deleting unarchived note
app.get('/notes/:id/deleteunarchived', (req, res) => {
  id = req.params.id;
  db.run('DELETE FROM notes WHERE id=?', id, (err) => {
    if (err) console.log(err.message);
    res.redirect('/notes');
  });
});

// deleting completed note
app.get('/notes/:id/deleteunarchived', (req, res) => {
  db.run('DELETE FROM notes WHERE id=?', req.params.id, (err) => {
    if (err) console.log(err.message);

    res.redirect('/notes');
  });
});

// going to edit page
app.get('/notes/:id/UPDATE', (req, res) => {
  db.get('select * FROM notes WHERE id = ?', req.params.id, (err, row) => {
    res.render('edit', { id: req.params.id, note: row });
  });
});

//updating selected student record
app.post(`/notes/:id/update`, (req, res) => {
  let userInput = req.body;

  if (userInput.note.length === 0) {
    db.get('select * FROM notes WHERE id = ?', req.params.id, (err, row) => {
      res.render('edit', { id: id, note: row, error: true });
    });
  } else {
    db.run(
      'UPDATE notes set description = ? WHERE id = ?',
      [userInput.note, req.params.id],
      (err) => {
        if (err) console.log(err.message);
      }
    );
    res.redirect('/notes');
  }
});

//going to archived page
app.get('/archive', (req, res) => {
  db.all('SELECT * FROM notes WHERE archived = 1', [], (err, rows) => {
    if (err) console.log(err.message);

    res.render('archive', { notes: rows });
  });
});

// archiving a note
app.get('/notes/:id/archive', (req, res) => {
  db.run('UPDATE notes set archived = 1 WHERE id = ?', req.params.id, (err) => {
    if (err) console.log(err.message);

    res.redirect('/notes');
  });
});

// uncarchiving a note
app.get('/notes/:id/unarchive', (req, res) => {
  db.run('UPDATE notes set archived = 0 WHERE id = ?', req.params.id, (err) => {
    if (err) console.log(err.message);

    res.redirect('/archive');
  });
});

app.listen(3000);
