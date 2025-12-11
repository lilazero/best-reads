import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, Calendar, MessageCircle } from "lucide-react";
import { GroupDetails } from "@/lib/mockData";
import { formatRelativeTime } from "@/lib/utils/timeFormat";

interface ClubPageProps {
  params: {
    id: string;
  };
}

export default function ClubPage({ params }: ClubPageProps) {
  // Special-case mock route for Goodreads 'Read With Jenna' group id
  // Accept either plain id or slugged forms like `988700-read-with-jenna-official`
  if (params.id.includes("988700")) {
    return (
      <div className="min-h-screen bg-primary-background dark:bg-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mainContentContainer">
            <div className="mainContent">
              <div id="premiumAdTop">
                <div
                  data-react-class="ReactComponents.GoogleBannerAd"
                  data-react-props='{"adId":"","className":"googleBannerAd--pushdown"}'
                />
              </div>

              <div className="mainContentFloat">
                <div id="flashContainer" />

                <div className="groupPic">
                  <div className="vcenterContainer">
                    <a
                      title="Read With Jenna (Official)"
                      className="groupPicLink"
                      href="/photo/group/988700-read-with-jenna-official"
                    >
                      <Image
                        alt="Read With Jenna (Official)"
                        src="https://images.gr-assets.com/groups/1643040655p3/988700.jpg"
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </a>
                  </div>
                  <div className="joinLinks">
                    <a
                      className="gr-button"
                      href="/group/join/988700-read-with-jenna-official"
                    >
                      Join Group
                    </a>
                  </div>
                </div>

                <div className="groupMasthead" />
                <h1>Read With Jenna (Official)</h1>

                <div className="leftContainer">
                  <div id="magicSpacer">
                    <div className="vcenterContainer">
                      <a
                        title="Read With Jenna (Official)"
                        className="groupPicLink"
                        href="/photo/group/988700-read-with-jenna-official"
                      >
                        <Image
                          alt="Read With Jenna (Official)"
                          src="https://images.gr-assets.com/groups/1643040655p3/988700.jpg"
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </a>
                    </div>
                    <div className="joinLinks">
                      <a
                        className="gr-button"
                        href="/group/join/988700-read-with-jenna-official"
                      >
                        Join Group
                      </a>
                    </div>
                  </div>

                  <div id="topInfo">
                    <div className="description">
                      <span>
                        When anyone on the TODAY team is looking for a book
                        recommendation, there is only one person to turn to:
                        Jenna Bush Hager.
                        <br />
                        <br />
                        Jenna will select a book and as you read along,
                        we&apos;ll be posting updates right here with
                        thought-provoking conversation starters. We hope
                        you&apos;ll engage with the rest of the
                        <a
                          href="https://www.today.com/read-with-jenna"
                          rel="nofollow noopener"
                        >
                          #ReadWithJenna
                        </a>{" "}
                        community to make this book club your own.
                        <br />
                        <br />
                        Our current book is{" "}
                        <a
                          href="https://www.goodreads.com/en/book/show/57846320"
                          rel="nofollow noopener"
                        >
                          &quot;The School for Good Mothers&quot; by Jessamine
                          Chan
                        </a>
                        .
                      </span>
                    </div>

                    <div id="groupBox">
                      <div className="infoBoxRowTitle">category</div>
                      <div className="infoBoxRowItem narrow">
                        <a href="/group/topic/1-books-literature?topic=Books+%26+Literature">
                          Books &amp; Literature
                        </a>{" "}
                        -&gt;{" "}
                        <a href="/group/subtopic/14-literature-fiction?subtopic=Literature+%26+Fiction&amp;topic=Books+%26+Literature">
                          Literature &amp; Fiction
                        </a>
                      </div>

                      <div className="infoBoxRowTitle">tags</div>
                      <div className="infoBoxRowItem">
                        <a href="/group/show_tag/988700?name=book-club">
                          book-club
                        </a>
                        ,{" "}
                        <a href="/group/show_tag/988700?name=book-clubs">
                          book-clubs
                        </a>
                        ,{" "}
                        <a href="/group/show_tag/988700?name=book-group">
                          book-group
                        </a>
                      </div>

                      <div className="infoBoxRowTitle">website</div>
                      <div className="infoBoxRowItem">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.today.com/read-with-jenna"
                        >
                          https://www.today.com/read-with-jenna
                        </a>
                      </div>

                      <div className="infoBoxRowTitle">group type</div>
                      <div className="infoBoxRowItem">
                        This is a private group. Members must be invited or
                        approved by the group&apos;s moderator.
                      </div>

                      <div className="infoBoxRowTitle">rules</div>
                      <div className="infoBoxRowItem">
                        Please be courteous to other book club members.
                        Self-promotion and spam will be removed.
                      </div>
                      <br className="clear" />
                    </div>
                    <div className="clear" />
                  </div>

                  <div className="flagOptionContainer">
                    <a
                      className="flag"
                      rel="nofollow"
                      title="Flag this group as inappropriate."
                      id="flag_link988700"
                      href="#"
                    >
                      flag
                    </a>
                  </div>

                  <div className="clear" />

                  <div className="clearFloats bigBox">
                    <div className="h2Container gradientHeaderContainer">
                      <h2 className="brownBackground">
                        <a href="#">Videos</a>
                      </h2>
                    </div>
                    <div className="bigBoxBody">
                      <div className="bigBoxContent containerWithHeaderContent">
                        <div className="clearFix">
                          <div
                            style={{
                              float: "left",
                              paddingRight: 10,
                              width: 296,
                            }}
                          >
                            <div className="videoThumbnail">
                              <a href="#">
                                <Image
                                  width={296}
                                  height={166}
                                  alt="Video"
                                  src="https://i.ytimg.com/vi/GizuavSGjlg/mqdefault.jpg"
                                />
                              </a>
                            </div>
                            <a className="videoTitle" href="#">
                              Barbara Bush Shares The Three Books She Recommends
                              Everyone Reads
                            </a>
                          </div>
                        </div>
                        <div className="textRight actionLinks clearTop">
                          <a className="actionLink" href="#">
                            More videos…
                          </a>
                        </div>
                        <div className="clear" />
                      </div>
                    </div>
                    <div className="bigBoxBottom" />
                  </div>

                  <div id="discussionBoard">
                    <div className="clearFloats bigBox">
                      <div className="h2Container gradientHeaderContainer">
                        <h2 className="brownBackground">
                          <a href="#">Discussion Board</a>
                        </h2>
                      </div>
                      <div className="bigBoxBody">
                        <div className="bigBoxContent containerWithHeaderContent">
                          <div className="mediumText">
                            Please <a href="#">join this group</a> to view the
                            discussion boards.
                          </div>
                          <div className="clear" />
                        </div>
                      </div>
                      <div className="bigBoxBottom" />
                    </div>
                  </div>

                  <div className="clearFloats bigBox">
                    <div className="h2Container gradientHeaderContainer">
                      <h2 className="brownBackground">
                        <a href="#">Members (29527)</a>
                      </h2>
                    </div>
                    <div className="bigBoxBody">
                      <div className="bigBoxContent containerWithHeaderContent">
                        <div
                          className="leftAlignedImage"
                          style={{
                            width: 75,
                            textAlign: "center",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            alt="SUHARLEY"
                            src="https://images.gr-assets.com/users/1706941024p2/155862808.jpg"
                            width={50}
                            height={66}
                          />
                          <br />
                          SUHARLEY
                        </div>
                        <div className="textRight actionLinks clearTop">
                          <a rel="nofollow" className="actionLink" href="#">
                            More members…
                          </a>
                        </div>
                        <div className="clear" />
                      </div>
                    </div>
                    <div className="bigBoxBottom" />
                  </div>
                </div>

                <div className="rightContainer">
                  <div className="stacked">
                    <div className="groupNav clearFix groupHomepage">
                      <div className="actionLinkLites">
                        <div className="clearFix">
                          <div className="col">
                            <a className="current" href="#">
                              Group Home
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="clear" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const group = GroupDetails[params.id];

  if (!group) {
    notFound();
  }

  const formatMemberCount = (count: number): string => {
    return count.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-primary-background dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/clubs"
          className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 inline-block"
        >
          ← Back to Groups
        </Link>

        {/* Group Header */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
          <div className="flex gap-6 items-start">
            {/* Group Icon */}
            <div className="shrink-0">
              {group.iconUrl ? (
                <Image
                  src={group.iconUrl}
                  alt={group.name}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-[120px] h-[120px] rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center ${
                  group.iconUrl ? "hidden" : "flex"
                }`}
              >
                <Users className="w-12 h-12 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>

            {/* Group Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {group.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formatMemberCount(group.membersCount)} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Active {formatRelativeTime(group.lastActiveAt)}</span>
                </div>
              </div>

              <button className="px-6 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors">
                Join Group
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                About this group
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                {group.fullDescription || group.description}
              </p>
            </section>

            {/* Recent Discussions */}
            {group.topics && group.topics.length > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Recent Discussions
                </h2>
                <div className="space-y-4">
                  {group.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="pb-4 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 last:pb-0"
                    >
                      <Link
                        href={`/clubs/${group.id}/topics/${topic.id}`}
                        className="text-neutral-900 dark:text-neutral-100 font-medium hover:underline"
                      >
                        {topic.title}
                      </Link>
                      <div className="flex gap-3 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>by {topic.author}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{topic.postsCount} posts</span>
                        </div>
                        <span>·</span>
                        <span>{formatRelativeTime(topic.lastPostAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rules */}
            {group.rules && group.rules.length > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Group Rules
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {group.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ol>
              </section>
            )}

            {/* Moderators */}
            {group.moderators && group.moderators.length > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Moderators
                </h2>
                <ul className="space-y-2">
                  {group.moderators.map((moderator, index) => (
                    <li
                      key={index}
                      className="text-neutral-700 dark:text-neutral-300"
                    >
                      {moderator}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
