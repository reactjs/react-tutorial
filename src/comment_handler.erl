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

%% @doc POST echo handler.
-module(comment_handler).

-define(FilePath, "./comments.json").

-export([init/3]).
-export([handle/2]).
-export([terminate/3]).

init(_Transport, Req, []) ->
	{ok, Req, undefined}.

handle(Req, State) ->
	{Method, Req2} = cowboy_req:method(Req),
	HasBody = cowboy_req:has_body(Req2),
	{ok, Req3} = maybe_comment(Method, HasBody, Req2),
	{ok, Req3, State}.

maybe_comment(<<"POST">>, true, Req) ->
	{ok, PostVals, Req2} = cowboy_req:body_qs(Req),
	comment(write_comments(read_comments(), PostVals), Req2);
maybe_comment(<<"POST">>, false, Req) ->
	cowboy_req:reply(400, [], <<"Missing body.">>, Req);
maybe_comment(<<"GET">>, _, Req) ->
	comment(read_raw_comments(), Req);
maybe_comment(_, _, Req) ->
	%% Method not allowed.
	cowboy_req:reply(405, Req).

comment(Comments, Req) ->
	%% always return json
	cowboy_req:reply(200, [
		{<<"content-type">>, <<"application/json; charset=utf-8">>},
		{<<"cache-control">>, <<"no-cache">>}
	], Comments, Req).

terminate(_Reason, _Req, _State) ->
	ok.

%% Private functions

read_raw_comments() ->
	{ok, F} = file:read_file(?FilePath),
	F.

read_comments() ->
	jiffy:decode(read_raw_comments()).

write_comments(Comments, NextComment) ->
	C = jiffy:encode(Comments ++ [{NextComment}],
					[force_utf8, pretty]),
	ok = file:write_file(?FilePath, C),
	C.
