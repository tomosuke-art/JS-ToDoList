window.onload = findBooks; // 画面ロード時に実行 onload = 関数

      const listArea = document.getElementById('list'); // リスト表示部

// 全データの取得（タスク）
      function findBooks() {
        const url = '/findBooks'; // 通信先
        const req = new XMLHttpRequest(); // 通信用オブジェクト、データが到着したときにコールバックを受け取る

        req.onreadystatechange = function() {
          if(req.readyState == 4 && req.status == 200) {  //リクエストが正常に終了したら
            const books = JSON.parse(req.response); //　req.response=server.jsの中のfindBooksの処理の結果がはいる
  //JSON.perse = メソッドは文字列を JSON として解析し、
               //文字列によって記述されている JavaScript の値やオブジェクトを構築
            //console.log(books); 
            for(let key in books) { 
              const day = key; //キーが日付
              const tasks = books[key]; //この中に{ID,タスク}の配列
              //addToList();を実行
              addToList(day, tasks, 
                        //review,
                        //id
                       );
            }
          }
        }
        req.open('GET', url, true);
       //リスト削除
        while(listArea.firstChild) listArea.removeChild(listArea.firstChild);
        req.send();
      }
// データの保存
      function saveBook() {
        const url = '/saveBook'; // 通信先
        const req = new XMLHttpRequest(); // 通信用オブジェクト

        const days = document.getElementById('day').value; //日付
        const price = document.getElementById('task').value; //タスク(todo)

        // 取得した情報をもとにオブジェクトを作る
        const book = {
          day:days, 
          task:price, 
         }; //この形でDBへ

        req.onreadystatechange = function() {
          if(req.readyState == 4 && req.status == 200) {
            const id = req.response; // レスポンスから得た ID
        
            findBooks();

            // 追加が成功したらフォームを空にする
            document.getElementById('day').value = '';
            document.getElementById('task').value = '';
          }
        }
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(book)); // オブジェクトを文字列化して送信
      }

      function deleteBook(id) {
        const url = '/deleteBook'; // 通信先
        const req = new XMLHttpRequest(); // 通信用オブジェクト

        const book = {id:id};

        req.onreadystatechange = function() {
          if(req.readyState == 4 && req.status == 200) {
            const target = document.getElementById(id); // ID で要素を特定
            target.parentNode.removeChild(target); // 親要素に自分を削除させる
            // findBooks()で画面表示を更新画面表示を更新
            findBooks();
          }
          }
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(book)); // オブジェクトを文字列化して送信
      }

      function addToList(day, tasks, 
                          //review, 
                          //id
                         ) {
        //CSSの処理link
        const bookDiv = document.createElement('div'); // 追加するタスクの div 要素
        //bookDiv.id = id; // レスポンスから得た ID を付与する
        bookDiv.style.width = '400px';
        bookDiv.style.margin = '20px auto'; // 上下に 20 ピクセルのマージンを
        bookDiv.style.padding = '5px'; // 内側に余裕を
        bookDiv.style.backgroundColor = '#C2EEFF'; // 背景色を明るめの水色に
        bookDiv.style.border = '1px solid black'; // 黒い枠を付ける
        bookDiv.style.borderRadius = '5px'; // 枠の角を少し丸く
        

        //days = 日付
        const daysSpan = document.createElement('span');
        daysSpan.innerText = day;
        daysSpan.style.fontSize = '20px';
        daysSpan.style.fontWeight = 'bold'; // 太字に
        daysSpan.style.display = 'block';
        daysSpan.style.width = '400px';
        
        bookDiv.appendChild(daysSpan); // bookDiv にタイトルを追加
        //タスクをまわす
        for(let i in tasks) { //price = task
          const leftDiv = document.createElement('div');
          leftDiv.style.display = 'inline-block';
          leftDiv.style.width = '200px';
          const priceSpan = document.createElement('span');
          priceSpan.id = tasks[i]._id; //task一つ一つにID
          priceSpan.style.display = 'inline-block';
          priceSpan.innerText = "・" + tasks[i].task; 
          bookDiv.appendChild(leftDiv);
          leftDiv.appendChild(priceSpan); // bookDiv にtaskを追加
  
          //ボタンの設定
          const rightDiv = document.createElement('div');
          rightDiv.style.display = 'inline-block';
          rightDiv.style.width = '180px';
          const delButton = document.createElement('button');
          delButton.innerText = '削除';
          delButton.onclick = function() {
            deleteBook(tasks[i]._id); // レスポンスから得た ID を利用して削除
          }
          bookDiv.appendChild(rightDiv);
          rightDiv.appendChild(delButton);
          rightDiv.style.textAlign = 'right';
          const br = document.createElement('br');
          // delButton.style.display = 'inline-block';
          // delButton.style.margin = '0 0 0 auto';
          bookDiv.appendChild(br);
        
        }
      
        // const reviewDiv = document.createElement('div');
        // reviewDiv.innerText = review;

//         const delButton = document.createElement('button');
//         delButton.innerText = '削除';
//         delButton.onclick = function() {
//           deleteBook(id); // レスポンスから得た ID を利用して削除
//         }
        
        //bookDiv.appendChild(titleSpan); // bookDiv にタイトルを追加
        //bookDiv.appendChild(priceSpan); // bookDiv に値段を追加
        //bookDiv.appendChild(reviewDiv); // bookDiv に感想を追加
        //bookDiv.appendChild(delButton);// bookDiv に削除ボタンを追加
        listArea.appendChild(bookDiv); // リストに bookDiv を追加
      }