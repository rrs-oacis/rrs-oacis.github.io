var switchNext = function(group, next)
{
    for (i=1;;i++)
    {
        var target;
        try { target = document.getElementById(group + i); }
        catch (e) { break; }

        if (i == next)
        { target.style.display = 'block'; }
        else
        { target.style.display = 'none'; }
    }
}
