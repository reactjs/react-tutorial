%% This file provided by Facebook is for non-commercial testing and evaluation
%% purposes only. Facebook reserves all rights not expressly granted.
%%
%% THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
%% IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
%% FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
%% FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
%% ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
%% WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
%%
%%
%% @private
-module(server_app).
-behaviour(application).

-export([start/2]).
-export([stop/1]).

start(_Type, _Args) ->
	Port = default_port(os:getenv("PORT")),
	Dispatch = cowboy_router:compile([
		{'_', [
			{"/api/comments", comment_handler, []},
			{"/", cowboy_static, {file, "./public/index.html"}},
			{"/[...]", cowboy_static, {dir, "./public",
				[{mimetypes, cow_mimetypes, all}]}}
		]}
	]),
	{ok, _} = cowboy:start_http(http, 10, [{port, Port}], [
		{env, [{dispatch, Dispatch}]}
	]),
	server_sup:start_link().

stop(_State) ->
	ok.


%% Utility

default_port(false) -> 3000;
default_port(N) -> N.
