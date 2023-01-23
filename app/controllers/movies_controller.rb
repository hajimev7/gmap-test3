class MoviesController < ApplicationController
    require "open-uri"

	def index
		@keyword = nil
		@string = nil
		@engine = nil
		@update = 0
		if params[:engine]
			@engine = params[:engine]
			# @engineの内容 ... 両方ともチェック済みの場合 {"0"=>"google", "1"=>"bing"}
		end
		if params[:update] != 0
			@update = params[:update]
		end
		if params[:keyword]
			@keyword = params[:keyword]
			date = "0"
			if @engine && @engine["0"]
				case @update
					when "1"
					 date = "d"
					when "2"
					 date = "w"
					when "3"
					 date = "m"
					else
					 date = nil
				end
				url = "https://www.google.co.jp/search?as_qdr=#{date}&as_q=#{@keyword}"
				url_escape = URI.escape(url)
				user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.63 Safari/537.36'
				charset = nil
				html = open(url_escape, "User-Agent" => user_agent) do |f|
				  charset = f.charset
				  f.read
				end

				@strings =  html.scan(%r{<h3 class="r">(.+?)</h3>})
			end
			if @engine && @engine["1"]
				case @update
					when "1"
					 date = 'ex1:"ez1"'
					when "2"
					 date = 'ex1:"ez2"'
					when "3"
					 date = 'ex1:"ez3"'
					else
					 date = nil
				end
				url = "http://www.bing.com/search?filters=#{date}&q=#{@keyword}"
				url_escape = URI.escape(url)
				user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.63 Safari/537.36'
				charset = nil
				html = open(url_escape, "User-Agent" => user_agent) do |f|
				  charset = f.charset
				  f.read
				end

				@strings2 = html.scan(%r{<h2>(.+?)</h2>})
			end
		end
	end
end
