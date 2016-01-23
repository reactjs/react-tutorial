defmodule ReactTutorial do
  def version,  do: unquote(Mix.Project.config[:version])
  def elixir_version, do: unquote(System.version)
  
  use Application

  def start( _type, _args ) do
    import Supervisor.Spec, warn: false
    
    children = [
      worker(__MODULE__, [], function: :run)
    ]

    opts = [strategy: :one_for_one, name: ReactTutorial.Supervisor]
    Supervisor.start_link(children, opts)
  end
  
  def run do
    { :ok, _ } = Plug.Adapters.Cowboy.http(Server, [], port: 3000)
  end

end
