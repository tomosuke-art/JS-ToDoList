//　必要なモジュールの読み込み
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
// mongoDBを使う処理
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const mongouri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.MONGOHOST;
app.use(express.static('public'));


app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

//DBから取ってくる処理
app.get('/findBooks', function(req, res){
  // resultのイメージはこんな感じ output　　//JS 指定した値の名前でsort 配列の中身
  //     const result = 
  //           [
  //       {
  //         "day":　"book.days",
  //         "tasks":[
  //           {
  //             "task":"タスク1",
  //             "_id":"aa"
  //           },
  //           {
  //             "task":"タスク2",
  //             "_id":"bb"
  //           }
  //         ]
  //       },
  //    ];
  // res.json(result); // レスポンスとしてユーザを JSON 形式で返却
  
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colBooks = db.collection('todotable'); // 対象コレクション（コレクション名はなんでもいい）

    // 検索条件（名前が「エクサくん」ではない）
    // 条件の作り方： https://docs.mongodb.com/manual/reference/operator/query/
    
    //全件検索
    const condition = {};

    //books = DBから帰ってきた中身
    colBooks.find(condition).toArray(function(err, books) {
      //DBに自分が入力した値を入れる処理
      const results = {};
      for(let i in books) { 
        const id = books[i]._id;
        const task = books[i].task;
        const day =  books[i].day;
        const result = {
            "task":task,
            "_id":id
          }
        if (results[day]){
          //"day"が既にresult内に存在する日付の場合  
          results[day].push(result);
        }else{
          //"day"が既にresult内に存在しない日付の場合 
          results[day] = [];
          results[day].push(result);
        } 
      };
      console.log(results);
      
      //booksの中身のイメージ input  
     // [
      //   {
      //     "_id":"",
      //     "task":"タスク",
      //     "day":"日付",
      //   },
      //   {
      //     "_id":"",
      //     "task":"タスク",
      //     "day":"日付",
      //   }
      // ]
      
      //TODO JSのデータ整形処理を記述
      
      // resultのイメージはこんな感じ output　　//受け取ったデータを整形
      //
      // const results = {
      //   9/26:[
      //     {
      //       "task":"タスク",
      //       "_id":"adssdafda"
      //     },
      //     {
      //       "task":"タスク",
      //       "_id":"adssdafda"
      //     }
      //   ],
      //  9/27:[
      //
      //    ]
      // }
      
      // const results = [
      //   {
      //     "day":,
      //     "tasks":[
      //       {
      //         "task":"タスク",
      //         "_id":""
      //       },
      //       {
      //         "task":"タスク",
      //         "_id":""
      //       }
      //     ]
      //   }
      // ]
      res.json(results); // レスポンスとしてユーザを JSON 形式で返却
      client.close(); // DB を閉じる
    });
  });
});

//完了　追加ボタンを押すと実行せれる処理
app.post('/saveBook', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colBooks = db.collection('todotable'); // 対象コレクション
      const books = JSON.parse(received); // 保存対象
      colBooks.insertOne(books, function(err, result) {
        res.send(decodeURIComponent(result.insertedId)); // 追加したデータの ID を返す
        client.close(); // DB を閉じる
      });
    });
  });
});

//完了
app.post('/deleteBook', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colBooks = db.collection('todotable'); // 対象コレクション
      const target = JSON.parse(received); // 保存対象
      const oid = new ObjectID(target.id);

      colBooks.deleteOne({_id:{$eq:oid}}, function(err, result) {
        res.sendStatus(200); // ステータスコードを返す
        client.close(); // DB を閉じる
      });
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
