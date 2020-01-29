FROM jekyll/jekyll

RUN mkdir /app
WORKDIR /app

#COPY Gemfile* /app/
#RUN bundle install

COPY . /app