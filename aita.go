package main

import (
	"context"
	"fmt"

	"github.com/vartanbeno/go-reddit/v2/reddit"
)

var ctx = context.Background()


func main() {
    fmt.Println("Hello, World!")
		client, err := reddit.NewReadonlyClient()
		if err != nil {
			fmt.Printf("error setting up client")
			fmt.Println(err)

			return
		}
		posts, _, err := client.Subreddit.ControversialPosts(ctx, "AmItheAsshole", &reddit.ListPostOptions{
			ListOptions: reddit.ListOptions{
				Limit: 1,
			},
			Time: "day",
		})
		if err != nil {
			fmt.Println("error getting posts")
			fmt.Println(err)
			return
		}
		
	for _, post := range posts {
		fmt.Printf(`::set-output name=title::%s`, post.Title)
		fmt.Print("\n")
		fmt.Printf(`::set-output name=body::%s`, post.Body)
		fmt.Print("\n")
		fmt.Printf(`::set-output name=url::%s`, post.Permalink)
		fmt.Print("\n")
		fmt.Print("done attempting to set outputs")
	}

}