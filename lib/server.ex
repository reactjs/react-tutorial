defmodule Server do
  import Plug.Conn

  def init(options) do
    Hex.Shell.info("Server started: http://localhost:3000/")
    options
  end

  def call(conn, _opts) do
    http_res(conn, conn.request_path)
  end

  def http_res(conn, uri) do
    cond do
      uri =~ ~r"index.html$|^/$|.js$|.css" ->
        fileName = get_file_name(uri)
        conn
        |> put_resp_content_type(get_content_type(conn.request_path))
        |> send_resp(200, get_file_content(fileName))
      uri == "/api/comments" ->
        case conn.method do
          "POST" ->
            conn = parse(conn)
            author = conn.params["author"]
            text = conn.params["text"]
            id = conn.params["id"]
            # Hex.Shell.info("post #{conn.query_string} author:#{author} text:#{text} id:#{id}")
            fileName = Path.join(root_path(), "comments.json")
            newComment = %{"author" => author, "id" => id, "text" => text}
            {:ok, content} = File.read("comments.json")
            currentComments = Poison.Parser.parse!(content)
            updatedCommentsJson = List.insert_at(currentComments, -1, newComment)
            content = Poison.encode!(updatedCommentsJson)
            File.write(fileName, content)
            conn
            |> send_resp(200, "post success")
          _ ->
            fileName = Path.join(root_path(), "comments.json")
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(200, get_file_content(fileName))
        end
      true ->
        conn
        |> send_resp(200, "Hello world")
    end
  end

  def parse(conn, opts \\ []) do
    opts = Keyword.put_new(opts, :parsers, [Plug.Parsers.URLENCODED, Plug.Parsers.MULTIPART])
    Plug.Parsers.call(conn, Plug.Parsers.init(opts))
  end
  
  def get_file_name(uri) do
    cond do
      uri =~ ~r"index.html$|^/$" ->
        Path.join(root_path(), "public/index.html")
      uri =~ ~r".js$|.css" ->
        Path.join(root_path(), "public" <> uri)
      true ->
        uri
    end
  end
  
  def root_path() do
    Path.join(__DIR__, "../") |> Path.expand()
  end
  
  def get_file_content(file) do
    case File.read(file) do
      {:ok, content} ->
        content
      {:error, _} ->
        "404 not find!"
    end
  end

  def get_content_type(request_path) do
    cond do
      request_path == "/" ->
        "text/html"
      request_path =~ ~r".html$|.htm$|.jsp$" ->
        "text/html"
      request_path =~ ~r".css$" ->
        "text/css"
      request_path =~ ~r".png$" ->
        "image/png"
      request_path =~ ~r".ico$" ->
        "image/x-icon"
      request_path =~ ~r".gif$" ->
        "image/gif"
      request_path =~ ~r".jpe$|.jpeg$" ->
        "image/jpeg"
      request_path =~ ~r".jpg$" ->
        "application/x-jpg"
      true ->
        "text/plain"
    end
  end

end
