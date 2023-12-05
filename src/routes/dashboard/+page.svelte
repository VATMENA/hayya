<script lang="ts">
    import {needsPermissions} from "$lib/perms";
    import * as Card from "$lib/components/ui/card";
    import {Button} from "$lib/components/ui/button";
    import Nav from "$lib/components/Nav.svelte";

    needsPermissions(["loggedin"]);
</script>

<Nav selected="dashboard"></Nav>

<div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Welcome, Web Eight!</h2>
    </div>

    <div class="grid grid-cols-3 gap-5">
        <div class="space-y-5">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Latest News</Card.Title>
                    <Card.Description>
                        <div>
                            <a class="font-medium text-primary underline underline-offset-4" href="/dashboard/news/1">Arabian vACC - Welcoming our new Division Director!</a>
                            <blockquote class="mt-2 border-l-2 pl-6 italic">
                                We ask all to welcome our new Division Director, Sir Firstname Lastname. They have been a dedicated member of...
                                <br>
                                <a class="border-l-2 font-medium text-primary underline underline-offset-4" href="/dashboard/news/1">Read more &rarr;</a>
                            </blockquote>

                        </div>

                    </Card.Description>
                </Card.Header>
            </Card.Root>

            <Card.Root>
                <Card.Header>
                    <Card.Title>HQ Feedback</Card.Title>
                    <Card.Description>
                        <Button class="mt-2">Report a bug or suggest a feature</Button>
                    </Card.Description>
                </Card.Header>
            </Card.Root>
        </div>
        <div class="space-y-5">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Training</Card.Title>
                    <Card.Description>
                        <div class="grid grid-cols-2 gap-5 mt-2">
                            <div>
                                <Card.Root>
                                    <Card.Header>
                                        <Card.Title>Last Session Received</Card.Title>
                                        <Card.Description>N/A</Card.Description>
                                    </Card.Header>
                                </Card.Root>
                            </div>
                            <div>
                                <Card.Root>
                                    <Card.Header>
                                        <Card.Title>Last Session Given</Card.Title>
                                        <Card.Description>N/A</Card.Description>
                                    </Card.Header>
                                </Card.Root>
                            </div>
                            <div class="col-span-2">
                                <Card.Root>
                                    <Card.Header>
                                        <Card.Title>Quick Actions</Card.Title>
                                        <Card.Description class="space-x-2">
                                            <Button class="mt-2">Request Training</Button>
                                            <Button>View Training Requests</Button>
                                            <Button>Resources</Button>
                                        </Card.Description>
                                    </Card.Header>
                                </Card.Root>
                            </div>
                            <div class="col-span-2">
                                <Card.Root>
                                    <Card.Header>
                                        <Card.Title>Upcoming Sessions</Card.Title>
                                        <Card.Description>

                                        </Card.Description>
                                    </Card.Header>
                                </Card.Root>
                            </div>
                        </div>
                    </Card.Description>
                </Card.Header>
            </Card.Root>
        </div>
        <div class="space-y-5">
        </div>
    </div>
</div>
