  const resolvedParts = useMemo(() => {
    if (!post?.content) return [];

    const mentionMap = new Map(
      (post.mentions || []).map((m) => [m.id.toString(), m.username])
    );
    const groupMap = new Map(
      (post.groups || []).map((g) => [g.id.toString(), g.name])
    );

    const tokens = post.content.split(" ");

    return tokens.reduce((parts, token) => {
      if (mentionMap.has(token)) {
        parts.push({ type: "mention", id: token, name: mentionMap.get(token) });
      } else if (groupMap.has(token)) {
        parts.push({ type: "group", id: token, name: groupMap.get(token) });
      } else {
        parts.push({ type: "text", value: token });
      }
      return parts;
    }, []);
  }, [post]);   