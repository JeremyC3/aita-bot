package main

import (
	"context"
	"fmt"

	"github.com/vartanbeno/go-reddit/v2/reddit"
)

var ctx = context.Background()


func main() {
    fmt.Println("Hello, World!")
		client, _ := reddit.NewReadonlyClient()
		posts, _, err := client.Subreddit.ControversialPosts(ctx, "AmItheAsshole", &reddit.ListPostOptions{
			ListOptions: reddit.ListOptions{
				Limit: 1,
			},
			Time: "day",
		})
		if err != nil {
			return
		}
		
	for _, post := range posts {
		fmt.Println(post.Title)
		fmt.Println(post.Body)
	}

}